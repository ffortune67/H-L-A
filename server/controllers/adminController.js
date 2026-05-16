const pool = require('../config/db');
const jwt = require('jsonwebtoken');

// Middleware to check if user is admin
const checkAdminAccess = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Check if user is admin
        const adminResult = await pool.query(
            'SELECT * FROM admin_users WHERE user_id = $1 AND is_active = TRUE',
            [decoded.id]
        );

        if (adminResult.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        req.admin = adminResult.rows[0];
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

// Get dashboard overview
const getDashboardOverview = async (req, res) => {
    try {
        const stats = await Promise.all([
            // Total donations
            pool.query('SELECT COUNT(*) as count, SUM(amount) as total FROM contributions'),
            // Pending donations
            pool.query('SELECT COUNT(*) as count FROM contributions WHERE status = $1', ['En attente']),
            // Verified donations
            pool.query('SELECT COUNT(*) as count FROM contributions WHERE status = $1', ['Vérifiée']),
            // Recent transactions
            pool.query(`
                SELECT c.*, u.email, m.transaction_type, m.transaction_reference 
                FROM contributions c 
                LEFT JOIN users u ON c.user_id = u.id 
                LEFT JOIN manual_transactions m ON c.id = m.contribution_id 
                ORDER BY c.created_at DESC 
                LIMIT 10
            `)
        ]);

        res.json({
            success: true,
            overview: {
                total_donations: parseInt(stats[0].rows[0].count) || 0,
                total_amount: parseFloat(stats[0].rows[0].total) || 0,
                pending_count: parseInt(stats[1].rows[0].count) || 0,
                verified_count: parseInt(stats[2].rows[0].count) || 0,
                recent_transactions: stats[3].rows
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all donations with filtering
const getDonations = async (req, res) => {
    try {
        const { status, cause, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;
        
        let query = `
            SELECT c.*, u.email, u.first_name, u.last_name, 
                   m.transaction_type, m.transaction_reference, m.verification_status
            FROM contributions c 
            LEFT JOIN users u ON c.user_id = u.id 
            LEFT JOIN manual_transactions m ON c.id = m.contribution_id
            WHERE 1=1
        `;
        const params = [];

        if (status) {
            query += ' AND c.status = $' + (params.length + 1);
            params.push(status);
        }

        if (cause) {
            query += ' AND c.cause = $' + (params.length + 1);
            params.push(cause);
        }

        query += ' ORDER BY c.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);

        const result = await pool.query(query, params);
        
        // Get total count
        let countQuery = 'SELECT COUNT(*) as count FROM contributions WHERE 1=1';
        const countParams = [];
        if (status) {
            countQuery += ' AND status = $' + (countParams.length + 1);
            countParams.push(status);
        }
        if (cause) {
            countQuery += ' AND cause = $' + (countParams.length + 1);
            countParams.push(cause);
        }

        const countResult = await pool.query(countQuery, countParams);

        res.json({
            success: true,
            donations: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(countResult.rows[0].count),
                pages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
            }
        });
    } catch (error) {
        console.error('Get donations error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get manual transactions for verification
const getManualTransactions = async (req, res) => {
    try {
        const { status, type, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT m.*, c.amount, c.currency, c.cause, u.email
            FROM manual_transactions m 
            JOIN contributions c ON m.contribution_id = c.id 
            LEFT JOIN users u ON c.user_id = u.id 
            WHERE 1=1
        `;
        const params = [];

        if (status) {
            query += ' AND m.verification_status = $' + (params.length + 1);
            params.push(status);
        }

        if (type) {
            query += ' AND m.transaction_type = $' + (params.length + 1);
            params.push(type);
        }

        query += ' ORDER BY m.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);

        const result = await pool.query(query, params);

        res.json({
            success: true,
            transactions: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: result.rows.length
            }
        });
    } catch (error) {
        console.error('Get manual transactions error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Verify manual transaction
const verifyTransaction = async (req, res) => {
    try {
        const { transaction_id, verification_status, notes } = req.body;

        if (!['verified', 'rejected', 'pending'].includes(verification_status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification status'
            });
        }

        // Update transaction
        const transactionResult = await pool.query(
            `UPDATE manual_transactions 
             SET verification_status = $1, verified_by_admin = $2, verified_at = NOW() 
             WHERE id = $3 
             RETURNING *`,
            [verification_status, req.admin.id, transaction_id]
        );

        if (transactionResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        const transaction = transactionResult.rows[0];

        // Update contribution status if verified
        if (verification_status === 'verified') {
            await pool.query(
                'UPDATE contributions SET status = $1 WHERE id = $2',
                ['Vérifiée', transaction.contribution_id]
            );
        } else if (verification_status === 'rejected') {
            await pool.query(
                'UPDATE contributions SET status = $1 WHERE id = $2',
                ['Rejetée', transaction.contribution_id]
            );
        }

        // Log audit
        if (notes) {
            await pool.query(
                `INSERT INTO audit_logs (user_id, action, details, ip_address) 
                 VALUES ($1, $2, $3, $4)`,
                [req.admin.user_id, 'transaction_verification', JSON.stringify({ transaction_id, verification_status, notes }), req.ip]
            );
        }

        res.json({
            success: true,
            message: 'Transaction verified',
            transaction: transaction
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update donation status
const updateDonationStatus = async (req, res) => {
    try {
        const { donation_id, status } = req.body;

        const validStatuses = ['Vérifiée', 'En attente', 'Rejetée', 'Annulée'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const result = await pool.query(
            'UPDATE contributions SET status = $1 WHERE id = $2 RETURNING *',
            [status, donation_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        // Audit log
        await pool.query(
            `INSERT INTO audit_logs (user_id, action, details, ip_address) 
             VALUES ($1, $2, $3, $4)`,
            [req.admin.user_id, 'donation_status_update', JSON.stringify({ donation_id, status }), req.ip]
        );

        res.json({
            success: true,
            message: 'Donation status updated',
            donation: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    checkAdminAccess,
    getDashboardOverview,
    getDonations,
    getManualTransactions,
    verifyTransaction,
    updateDonationStatus
};
