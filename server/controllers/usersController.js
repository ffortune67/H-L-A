const pool = require('../config/db');
const { hashPassword } = require('../services/authService');

// Get user profile
const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT id, email, first_name, last_name, phone, country, organization, email_verified, created_at FROM users WHERE id = $1 AND deleted_at IS NULL',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = result.rows[0];
        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                phone: user.phone,
                country: user.country,
                organization: user.organization,
                emailVerified: user.email_verified,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update user profile
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, phone, country, organization } = req.body;

        // Check authorization
        if (req.user?.userId !== parseInt(id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this user'
            });
        }

        const result = await pool.query(
            `UPDATE users 
            SET first_name = COALESCE($1, first_name),
                last_name = COALESCE($2, last_name),
                phone = COALESCE($3, phone),
                country = COALESCE($4, country),
                organization = COALESCE($5, organization),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6 AND deleted_at IS NULL
            RETURNING id, email, first_name, last_name, phone, country, organization, created_at`,
            [firstName, lastName, phone, country, organization, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = result.rows[0];
        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                phone: user.phone,
                country: user.country,
                organization: user.organization,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete user (soft delete)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check authorization
        if (req.user?.userId !== parseInt(id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this user'
            });
        }

        const result = await pool.query(
            'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user's donation history
const getUserDonations = async (req, res) => {
    try {
        const { id } = req.params;

        // Check authorization
        if (req.user?.userId !== parseInt(id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this user\'s donations'
            });
        }

        const result = await pool.query(
            `SELECT id, amount, currency, cause, frequency, payment_method, status, created_at 
            FROM contributions 
            WHERE user_id = $1 
            ORDER BY created_at DESC`,
            [id]
        );

        res.json({
            success: true,
            donations: result.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change password
const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        // Check authorization
        if (req.user?.userId !== parseInt(id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current and new password are required'
            });
        }

        const userResult = await pool.query('SELECT password_hash FROM users WHERE id = $1', [id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const { comparePassword } = require('../services/authService');
        const passwordMatch = await comparePassword(currentPassword, userResult.rows[0].password_hash);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        const newPasswordHash = await hashPassword(newPassword);
        await pool.query(
            'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [newPasswordHash, id]
        );

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getUser,
    updateUser,
    deleteUser,
    getUserDonations,
    changePassword
};
