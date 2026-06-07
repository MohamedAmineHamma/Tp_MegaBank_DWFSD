const Compte = require('../models/compte');
const Transaction = require('../models/transaction');

exports.history = async (req, res, next) => {
    try {
       let filtre = {};
         if(req.user.role !== 'ADMIN') {
            const comptes = await Compte.find({ proprietaire: req.user._id }).select('_id');
            filter = { compte: { $in: comptes.map(c => c._id) } };
        }
        const tx = await Transaction.find(filtre).populate('compte', 'numero type').populate('comptepartie', 'numero').sort({ createdAt: -1 })
        .limit(100);
        res.json(tx);
    } catch (err) {
        next(err);
    }
};
