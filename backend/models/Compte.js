const mongoose = require('mongoose');

const compteSchema = new mongoose.Schema({
    numero: { type: String, required: true, unique: true },
    type: { type: String, enum: ['COURANT', 'EPARGNE'], default: 'COURANT' },
    solde: { type: Number, min: 0, required: true, default: 0 },
    devise: { type: String, default: 'MAD' },
    proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    actif: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Compte', compteSchema);