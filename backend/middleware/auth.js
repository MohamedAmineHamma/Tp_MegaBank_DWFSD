const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
        if(!token) return res.status(401).json({ message: 'Token manquant' });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if(!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalide' });
    }
};

exports.adminOnly = (req, res, next) => {
    if(req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
    }
    next();
};