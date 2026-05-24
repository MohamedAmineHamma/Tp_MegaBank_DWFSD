const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    reference: { type: String, required: true, index: true },
    type: { type: String, enum: ['DEBIT', 'CREDIT'], required: true },
    montant: { type: Number, required: true, min: 0.01 },
    compte: { type: mongoose.Schema.Types.ObjectId, ref: 'Compte', required: true },
    comptepartie : { type: mongoose.Schema.Types.ObjectId, ref: 'Compte'},
    libelle: { type: String, default: '' },
    soldeApres: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
