const pool = require('../config/db'); // On utilise uniquement 'pool' pour PostgreSQL

// 1. Enregistrement initial de l'intention de don (Donateur)
exports.processPayment = async (req, res) => {
  try {
    const { amount, paymentMethod, cause, customer, frequency, userId } = req.body;

    // Validation de base des champs obligatoires
    if (!amount || !paymentMethod) {
      return res.status(400).json({ 
        success: false, 
        message: "Le montant et la méthode de paiement sont obligatoires." 
      });
    }

    // Insertion SQL dans la table 'contributions'
    const queryText = `
      INSERT INTO contributions (user_id, amount, cause, frequency, payment_method, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING id, amount, cause, payment_method, status, created_at;
    `;

    const values = [
      userId || null, 
      amount, 
      cause || 'general', 
      frequency || 'unique', 
      paymentMethod
    ];

    const result = await pool.query(queryText, values);
    const nouvelleContribution = result.rows[0]; // Correction déjà intégrée ici

    // Réponse selon la méthode choisie
    if (paymentMethod === 'virement' || paymentMethod === 'bank_transfer') {
      return res.status(201).json({
        success: true,
        type: 'bank-transfer',
        message: "Votre promesse de contribution a été enregistrée avec succès.",
        id: nouvelleContribution.id,
        instructions: {
          banque: "RAWBANK / BCC",
          motif: `HLA-${nouvelleContribution.id}`,
          texte: `Veuillez effectuer votre virement pour le programme "${cause || 'Général'}". Indiquez impérativement le motif ci-dessus.`
        }
      });
    }

    if (paymentMethod === 'mobile') {
      return res.status(201).json({
        success: true,
        type: 'mobile-money',
        message: "Votre intention de paiement mobile a été enregistrée.",
        id: nouvelleContribution.id,
        instructions: {
          texte: "Veuillez effectuer le transfert vers l'un de nos numéros officiels, puis saisissez votre référence SMS reçue."
        }
      });
    }

    return res.status(201).json({ 
      success: true, 
      message: "Enregistré avec succès en attente de validation.",
      contribution: nouvelleContribution
    });

  } catch (error) {
    console.error("Erreur Backend PostgreSQL (processPayment):", error);
    return res.status(500).json({ 
      success: false, 
      message: "Erreur lors de l'enregistrement de la contribution.",
      error: error.message 
    });
  }
};

// 2. Lister toutes les transactions manuelles en attente (Espace Admin)
exports.getPendingTransactions = async (req, res) => {
    try {
        const queryText = `
            SELECT 
                mt.id AS transaction_id,
                mt.transaction_reference,
                mt.transaction_type,
                mt.mobile_provider,
                mt.created_at AS declared_at,
                c.id AS contribution_id,
                c.amount,
                c.cause,
                u.name AS donor_name,
                u.email AS donor_email
            FROM manual_transactions mt
            JOIN contributions c ON mt.contribution_id = c.id
            LEFT JOIN users u ON c.user_id = u.id
            WHERE mt.verified = false
            ORDER BY mt.created_at DESC;
        `;
        // CORRECTION : Utilisation de 'pool.query' au lieu de 'db.query'
        const result = await pool.query(queryText);
        res.status(200).json({ success: true, transactions: result.rows });
    } catch (error) {
        console.error("Erreur Backend (getPendingTransactions):", error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des transactions.', error: error.message });
    }
};

// 3. Valider manuellement une transaction (Espace Admin)
exports.verifyTransaction = async (req, res) => {
    const { transaction_id } = req.params;
    const { admin_id } = req.body;

    try {
        // CORRECTION : Utilisation de 'pool.query' au lieu de 'db.query'
        await pool.query('BEGIN');

        // Mettre à jour la table des transactions déclarées
        const txUpdate = await pool.query(
            `UPDATE manual_transactions 
             SET verified = true, verified_by = $1, verified_at = CURRENT_TIMESTAMP 
             WHERE id = $2 
             RETURNING contribution_id`,
            [admin_id || null, transaction_id]
        );

        if (txUpdate.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ success: false, message: 'Transaction introuvable.' });
        }

        // CORRECTION : Récupération correcte du premier élément du tableau [0]
        const contributionId = txUpdate.rows[0].contribution_id;

        // Passer le statut du don d'origine à 'confirmed'
        await pool.query(
            "UPDATE contributions SET status = 'confirmed' WHERE id = $1",
            [contributionId]
        );

        await pool.query('COMMIT');
        res.status(200).json({ success: true, message: 'Don validé et confirmé avec succès !' });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Erreur Backend (verifyTransaction):", error);
        res.status(500).json({ success: false, message: 'Erreur lors de la validation.', error: error.message });
    }
};
