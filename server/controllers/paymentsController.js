const pool = require('../config/db');

// Get bank account information for virement
const getBankAccounts = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM bank_accounts WHERE is_active = TRUE'
        );
        res.json({
            success: true,
            accounts: result.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get mobile money accounts
const getMobileMoneyAccounts = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM mobile_money_accounts WHERE is_active = TRUE'
        );
        res.json({
            success: true,
            accounts: result.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create a bank transfer payment with reference code
const createBankTransferPayment = async (req, res) => {
    try {
        const { contribution_id } = req.body;

        // Verify contribution exists
        const contribResult = await pool.query(
            'SELECT * FROM contributions WHERE id = $1',
            [contribution_id]
        );

        if (contribResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Contribution not found'
            });
        }

        const contribution = contribResult.rows[0];

        // Generate unique reference code
        const referenceCode = `REF-HLA-${Math.floor(Math.random() * 10000)}`;

        // Create manual transaction record
        const transactionResult = await pool.query(
            `INSERT INTO manual_transactions 
            (contribution_id, transaction_reference, transaction_type) 
            VALUES ($1, $2, $3) 
            RETURNING *`,
            [contribution_id, referenceCode, 'bank_transfer']
        );

        // Update contribution status
        await pool.query(
            'UPDATE contributions SET status = $1 WHERE id = $2',
            ['En attente', contribution_id]
        );

        res.status(201).json({
            success: true,
            message: 'Bank transfer initiated',
            transaction: transactionResult.rows[0],
            reference_code: referenceCode,
            amount: contribution.amount,
            currency: contribution.currency
        });
    } catch (error) {
        console.error('Bank transfer error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create mobile money payment with transaction ID input
const createMobileMoneyPayment = async (req, res) => {
    try {
        const { contribution_id, provider, transaction_id, phone_number } = req.body;

        // Verify contribution exists
        const contribResult = await pool.query(
            'SELECT * FROM contributions WHERE id = $1',
            [contribution_id]
        );

        if (contribResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Contribution not found'
            });
        }

        const contribution = contribResult.rows[0];

        // Create manual transaction record
        const transactionResult = await pool.query(
            `INSERT INTO manual_transactions 
            (contribution_id, transaction_reference, transaction_type, mobile_provider) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`,
            [contribution_id, transaction_id, 'mobile_money', provider]
        );

        // Update contribution status
        await pool.query(
            'UPDATE contributions SET status = $1 WHERE id = $2',
            ['En attente', contribution_id]
        );

        res.status(201).json({
            success: true,
            message: 'Mobile money payment recorded',
            transaction: transactionResult.rows[0],
            transaction_reference: transaction_id,
            provider: provider,
            amount: contribution.amount,
            currency: contribution.currency
        });
    } catch (error) {
        console.error('Mobile money error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create card payment (manual entry of confirmation)
const createCardPayment = async (req, res) => {
    try {
        const { contribution_id, card_last4, bank_name, transaction_id } = req.body;

        // Verify contribution exists
        const contribResult = await pool.query(
            'SELECT * FROM contributions WHERE id = $1',
            [contribution_id]
        );

        if (contribResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Contribution not found'
            });
        }

        const contribution = contribResult.rows[0];

        // Create manual transaction record
        const transactionResult = await pool.query(
            `INSERT INTO manual_transactions 
            (contribution_id, transaction_reference, transaction_type) 
            VALUES ($1, $2, $3) 
            RETURNING *`,
            [contribution_id, transaction_id || `TXN-${Date.now()}`, 'card']
        );

        // Update contribution status
        await pool.query(
            'UPDATE contributions SET status = $1 WHERE id = $2',
            ['En attente', contribution_id]
        );

        res.status(201).json({
            success: true,
            message: 'Card payment recorded',
            transaction: transactionResult.rows[0],
            card_last4: card_last4,
            bank: bank_name,
            amount: contribution.amount,
            currency: contribution.currency
        });
    } catch (error) {
        console.error('Card payment error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get payment confirmation details
const getPaymentConfirmation = async (req, res) => {
    try {
        const { contribution_id } = req.params;

        const contribResult = await pool.query(
            'SELECT * FROM contributions WHERE id = $1',
            [contribution_id]
        );

        if (contribResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Contribution not found'
            });
        }

        const contribution = contribResult.rows[0];

        // Get transaction details
        const transactionResult = await pool.query(
            'SELECT * FROM manual_transactions WHERE contribution_id = $1',
            [contribution_id]
        );

        const transaction = transactionResult.rows[0] || null;

        // Get bank account info for virement
        let bankAccount = null;
        if (contribution.payment_method === 'virement' || transaction?.transaction_type === 'bank_transfer') {
            const bankResult = await pool.query(
                'SELECT * FROM bank_accounts WHERE is_active = TRUE AND is_primary = TRUE'
            );
            bankAccount = bankResult.rows[0] || null;
        }

        // Get mobile money info
        let mobileAccount = null;
        if (transaction?.transaction_type === 'mobile_money') {
            const mobileResult = await pool.query(
                'SELECT * FROM mobile_money_accounts WHERE provider_name = $1 AND is_active = TRUE',
                [transaction.mobile_provider]
            );
            mobileAccount = mobileResult.rows[0] || null;
        }

        res.json({
            success: true,
            contribution: {
                id: contribution.id,
                amount: contribution.amount,
                currency: contribution.currency,
                cause: contribution.cause,
                frequency: contribution.frequency,
                payment_method: contribution.payment_method,
                status: contribution.status,
                created_at: contribution.created_at
            },
            transaction: transaction,
            bank_account: bankAccount,
            mobile_account: mobileAccount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Submit payment proof (screenshot, SMS, etc.)
const submitPaymentProof = async (req, res) => {
    try {
        const { transaction_id, proof_url } = req.body;

        const result = await pool.query(
            `UPDATE manual_transactions 
            SET payment_proof_url = $1 
            WHERE id = $2 
            RETURNING *`,
            [proof_url, transaction_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.json({
            success: true,
            message: 'Payment proof submitted',
            transaction: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get organization contacts (for display)
const getOrganizationContacts = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM organization_contacts WHERE is_public = TRUE'
        );
        res.json({
            success: true,
            contacts: result.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getBankAccounts,
    getMobileMoneyAccounts,
    createBankTransferPayment,
    createMobileMoneyPayment,
    createCardPayment,
    getPaymentConfirmation,
    submitPaymentProof,
    getOrganizationContacts
};
