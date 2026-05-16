const { registerUser, loginUser, refreshAccessToken } = require('../services/authService');

// Register new user
const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const result = await registerUser(email, password, firstName, lastName);
        res.status(201).json(result);
    } catch (error) {
        console.error('Register error:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const result = await loginUser(email, password);
        
        // Set refresh token as httpOnly cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json(result);
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

// Refresh token
const refresh = async (req, res) => {
    try {
        const token = req.body.refreshToken || req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token required'
            });
        }

        const result = await refreshAccessToken(token);
        res.json(result);
    } catch (error) {
        console.error('Refresh error:', error);
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

// Logout user
const logout = async (req, res) => {
    try {
        res.clearCookie('refreshToken');
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        const pool = require('../config/db');
        const result = await pool.query(
            'SELECT id, email, first_name, last_name, phone, country, organization, created_at FROM users WHERE id = $1',
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: result.rows[0].id,
                email: result.rows[0].email,
                firstName: result.rows[0].first_name,
                lastName: result.rows[0].last_name,
                phone: result.rows[0].phone,
                country: result.rows[0].country,
                organization: result.rows[0].organization,
                createdAt: result.rows[0].created_at
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    register,
    login,
    refresh,
    logout,
    getCurrentUser
};
