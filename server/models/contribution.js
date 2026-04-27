const mongoose = require('mongoose');

// On définit la structure d'une "Promesse de Contribution"
const ContributionSchema = new mongoose.Schema({
  // Identité du contributeur
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },

  // Détails de la contribution
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD' },
  
  // Le programme choisi (ex: Ora Labora, MC HAW)
  cause: { 
    type: String, 
    required: true,
    enum: ['Ora Labora', 'MC HAW', 'Avocats Humanitaires', 'Accès Humanitaire', 'Évaluation'] 
  },
  
  frequency: { type: String, enum: ['unique', 'mensuel', 'annuel'], default: 'unique' },

  // Suivi administratif
  status: { 
    type: String, 
    enum: ['En attente', 'Confirmé', 'Annulé'], 
    default: 'En attente' 
  },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contribution', ContributionSchema);
