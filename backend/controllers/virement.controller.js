const Compte = require('../models/compte');
const Transaction = require('../models/transaction');
const cryto = require('crypto');


exports.effectuer = async (req, res, next) => {
    try {
        const { sourceId, destinationId, montant, libelle } = req.body;

        if( !sourceId || !destinationId || !montant ) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        if(sourceId === destinationId) {
            return res.status(400).json({ message: 'Le compte source et destination doivent être différents' });
        }
        if(montant <= 0) {
            return res.status(400).json({ message: 'Le montant doit être positif' });
        }

        const source = await Compte.findById(sourceId);
        const destination = await Compte.findById(destinationId);
        if (!source || !destination) 
            return res.status(404).json({ message: 'Compte source ou destination introuvable' });
        
        if(!source.proprietaire.equals(req.user._id)) {
            return res.status(403).json({ message: 'Vous n\'êtes pas le propriétaire du compte source' });
        }
        
        if (source.solde < montant) {
            return res.status(400).json({ message: 'solde insuffisants sur le compte source' });
        }

        const reference = 'VIR-' + cryto.randomBytes(6).toString('hex').toUpperCase();

        source.solde -= Number(montant);
        destination.solde += Number(montant);
        await source.save();
        await destination.save();

        const debit  = await Transaction.create({
            reference, type : 'DEBIT' , montant, compte: source._id, 
            contrepartie: destination._id, libelle: libelle || 'Virement émis',
            soldeApres: source.solde

        });

        const credit  = await Transaction.create({
            reference, type : 'CREDIT' , montant, compte: destination._id, 
            contrepartie: source._id, libelle: libelle || 'Virement reçu',
            soldeApres: destination.solde
        });

        res.status(201).json({ message: 'Virement effectué avec succès',reference,  debit, credit , nouveauSoldeSource: source.solde, nouveauSoldeDestination: destination.solde });
    } catch (err) {
        next(err);
    }
};