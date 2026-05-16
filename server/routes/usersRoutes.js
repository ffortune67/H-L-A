const express = require('express');
const router = express.Router();
const { 
    getUser, 
    updateUser, 
    deleteUser, 
    getUserDonations, 
    changePassword 
} = require('../controllers/usersController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All user routes require authentication
router.get('/:id', authenticateToken, getUser);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);
router.get('/:id/donations', authenticateToken, getUserDonations);
router.post('/:id/change-password', authenticateToken, changePassword);

module.exports = router;
