const express = require('express');
const router = express.Router();
const { 
    getBankAccounts,
    getMobileMoneyAccounts,
    createBankTransferPayment,
    createMobileMoneyPayment,
    createCardPayment,
    getPaymentConfirmation,
    submitPaymentProof,
    getOrganizationContacts
} = require('../controllers/paymentsController');
const { optionalAuth } = require('../middleware/authMiddleware');

// Get payment method information (public)
router.get('/methods/bank', getBankAccounts);
router.get('/methods/mobile', getMobileMoneyAccounts);
router.get('/contacts', getOrganizationContacts);

// Create payment records (with optional auth)
router.post('/bank-transfer', optionalAuth, createBankTransferPayment);
router.post('/mobile-money', optionalAuth, createMobileMoneyPayment);
router.post('/card', optionalAuth, createCardPayment);

// Get confirmation details
router.get('/confirmation/:contribution_id', getPaymentConfirmation);

// Submit proof of payment
router.post('/proof', optionalAuth, submitPaymentProof);

module.exports = router;
