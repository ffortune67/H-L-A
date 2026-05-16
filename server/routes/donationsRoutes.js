const express = require('express');
const router = express.Router();
const { 
    createContribution, 
    getContribution, 
    getUserContributions, 
    updateContributionStatus, 
    getAllContributions 
} = require('../controllers/donationsController');
const { authenticateToken, optionalAuth } = require('../middleware/authMiddleware');

// Create contribution (public - optional auth for user tracking)
router.post('/', optionalAuth, createContribution);

// Get specific contribution
router.get('/:id', getContribution);

// Get user's contributions (protected)
router.get('/user/contributions', authenticateToken, getUserContributions);

// Update contribution status (protected)
router.put('/:id', authenticateToken, updateContributionStatus);

// Get all contributions (public for stats, admin-only in production)
router.get('/', getAllContributions);

module.exports = router;
