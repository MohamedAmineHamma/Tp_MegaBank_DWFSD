const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const signToken = (user) => {
    return jwt.sign ({ userId : user._id, role: user.role }, 
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN  || '10h' });
}

exports.register = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { nom, email, password, telephone } = req.body;
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        const user = await User.create({ nom, email, password, telephone, role : 'CLIENT' });
        const token = signToken(user);
        res.status(201).json({ token, user: { id: user._id, nom: user.nom, email: user.email, role: user.role } });
    } catch (error) {
        next(error);

    }
};

exports.login = async (req, res, next) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        
        const ok = await user.comparePassword(password);
        if (!ok) return res.status(401).json({ message: 'Identifiant invalides' });

        const token = signToken(user);
        res.json({ token, user: { id: user._id, nom: user.nom, email: user.email, role: user.role } });
    }
    catch (error) {
        next(error);
    }
};

exports.me = (req, res) => {
    res.json({ id: req.user._id, nom: req.user.nom, email: req.user.email, role: req.user.role, telephone: req.user.telephone });
};