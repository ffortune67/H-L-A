const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    refresh, 
    logout, 
    getCurrentUser 
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

// Protected routes
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;
