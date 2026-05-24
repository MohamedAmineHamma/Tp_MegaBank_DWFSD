const Compte = require('../models/compte');
const User = require('../models/User');


exports.list = async (req, res, next) => {
    try {
        const filtre = req.user.role === 'ADMIN' ? {} : { proprietaire: req.user._id };

        const comptes =  await Compte.find(filtre).populate('proprietaire', 'nom email') 
        .sort({ createdAt: -1 });
        res.json(comptes);
    } catch (err) {
        next(err);
    }
};


exports.getOne = async (req, res, next) => {
    try {
        const compte = await Compte.findById(req.params.id).populate('proprietaire', 'nom email');
        if (!compte) return res.status(404).json({ message: 'Compte non trouvé' });
        const isOwner = compte.proprietaire._id.equals(req.user._id);
        if (!isOwner && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Accès interdit' });
        }
        res.json(compte);
    } catch (err) {
        next(err);
    }
};


exports.create = async (req, res, next) => {
    try {
        const { proprietaireId, type, soldeInitiali } = req.body;
        if(!proprietaireId ) return res.status(400).json({ message: 'Le propriétaire est requis' });

        const client = await User.findById(proprietaireId);
        if (!client) return res.status(400).json({ message: 'Client  invalide' });
        

        const count = await Compte.countDocuments();
        const numero = 'Mega-' + String(count + 1).padStart(4, '0') + '-2026'; 

        const compte = await Compte.create({
            numero,
            type: type || 'COURANT',
            solde: soldeInitiali || 0,
            proprietaire: client._id    
        });
        res.status(201).json(compte);
    } catch (err) {
        next(err);
    }
};