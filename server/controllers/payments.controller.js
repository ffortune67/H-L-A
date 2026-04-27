const Contribution = require('../models/Contribution');

exports.processPayment = async (req, res) => {
  try {
    const { amount, paymentMethod, cause, customer } = req.body;

    // 1. On prépare les données selon notre Modèle
    const nouvelleContribution = new Contribution({
      firstName: customer?.firstName,
      lastName: customer?.lastName,
      email: customer?.email,
      phone: customer?.phone,
      amount: amount,
      cause: cause,
      paymentMethod: paymentMethod, // virement, mobile, etc.
      status: 'En attente'
    });

    // 2. On enregistre dans MongoDB
    await nouvelleContribution.save();

    // 3. Réponse selon la méthode choisie
    if (paymentMethod === 'virement') {
      return res.status(201).json({
        success: true,
        type: 'bank-transfer',
        message: "Votre promesse de contribution a été enregistrée.",
        instructions: `Veuillez effectuer votre virement pour le programme ${cause}.\nBanque: RAWBANK\nMotif: HLA-${nouvelleContribution._id}`,
        id: nouvelleContribution._id
      });
    }

    // Par défaut si c'est une autre méthode simulée
    res.status(201).json({ success: true, message: "Enregistré avec succès" });

  } catch (error) {
    console.error("Erreur Backend:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de l'enregistrement de la contribution",
      error: error.message 
    });
  }
};
