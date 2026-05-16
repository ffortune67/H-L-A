const express = require('express');
const router = express.Router();
const { 
    checkAdminAccess,
    getDashboardOverview,
    getDonations,
    getManualTransactions,
    verifyTransaction,
    updateDonationStatus
} = require('../controllers/adminController');

// All admin routes require admin access
router.use(checkAdminAccess);

// Dashboard
router.get('/dashboard', getDashboardOverview);

// Donations management
router.get('/donations', getDonations);
router.put('/donations/:id/status', updateDonationStatus);

// Manual transactions verification
router.get('/transactions', getManualTransactions);
router.post('/transactions/:id/verify', verifyTransaction);

module.exports = router;
