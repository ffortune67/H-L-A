const pool = require('../config/db');

// Create a new contribution
const createContribution = async (req, res) => {
    try {
        const { amount, currency, cause, frequency, paymentMethod, customer } = req.body;

        // Validation
        if (!amount || !cause || !paymentMethod || !customer?.email) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const validCauses = ['Ora Labora', 'MC HAW', 'Avocats Humanitaires', 'Accès Humanitaire', 'Évaluation', 'general', 'education', 'eau', 'sante'];
        const validFrequencies = ['unique', 'mensuel', 'annuel'];
        const validMethods = ['card', 'mobile', 'virement'];

        if (!validCauses.includes(cause)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid cause'
            });
        }

        if (!validFrequencies.includes(frequency || 'unique')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid frequency'
            });
        }

        if (!validMethods.includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment method'
            });
        }

        // Get user ID if authenticated
        const userId = req.user?.userId || null;

        // Insert contribution
        const result = await pool.query(
            `INSERT INTO contributions 
            (user_id, email, first_name, last_name, phone, amount, currency, cause, frequency, payment_method, status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING *`,
            [
                userId,
                customer.email,
                customer.firstName,
                customer.lastName,
                customer.phone || null,
                amount,
                currency || 'USD',
                cause,
                frequency || 'unique',
                paymentMethod,
                'En attente'
            ]
        );

        const contribution = result.rows[0];

        // Response based on payment method
        if (paymentMethod === 'virement') {
            return res.status(201).json({
                success: true,
                type: 'bank-transfer',
                message: 'Votre promesse de contribution a été enregistrée.',
                instructions: `Veuillez effectuer votre virement pour le programme ${cause}.\nBanque: RAWBANK\nMotif: HLA-${contribution.id}`,
                id: contribution.id
            });
        }

        res.status(201).json({
            success: true,
            message: 'Contribution created successfully',
            contribution: {
                id: contribution.id,
                amount: contribution.amount,
                cause: contribution.cause,
                status: contribution.status,
                createdAt: contribution.created_at
            }
        });
    } catch (error) {
        console.error('Create contribution error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating contribution',
            error: error.message
        });
    }
};

// Get contribution by ID
const getContribution = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM contributions WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Contribution not found'
            });
        }

        res.json({
            success: true,
            contribution: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user's contributions
const getUserContributions = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const result = await pool.query(
            'SELECT * FROM contributions WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        res.json({
            success: true,
            contributions: result.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update contribution status
const updateContributionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['En attente', 'Confirmé', 'Annulé', 'Remboursé'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const result = await pool.query(
            'UPDATE contributions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Contribution not found'
            });
        }

        res.json({
            success: true,
            contribution: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all contributions (admin only)
const getAllContributions = async (req, res) => {
    try {
        const { status, cause, limit = 50, offset = 0 } = req.query;

        let query = 'SELECT * FROM contributions WHERE 1=1';
        const params = [];

        if (status) {
            query += ` AND status = $${params.length + 1}`;
            params.push(status);
        }

        if (cause) {
            query += ` AND cause = $${params.length + 1}`;
            params.push(cause);
        }

        query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(parseInt(limit), parseInt(offset));

        const result = await pool.query(query, params);

        res.json({
            success: true,
            contributions: result.rows,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createContribution,
    getContribution,
    getUserContributions,
    updateContributionStatus,
    getAllContributions
};
