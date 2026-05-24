const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    nom: { type: String, required: true , trim : true, minLength : 2, maxLength : 50},
    email: { type: String, required: true, unique: true, trim: true, lowercase: true , match: [/^\S+@\S+\.\S+$/, 'Email invalide' ] },
    password: { type: String, required: true, minlength: 6 , select : false },
    role: { type: String, enum: ['CLIENT', 'ADMIN'], default: 'CLIENT' },
    telephone: { type: String, default: '' }
}, { timestamps: true });


// HACHAGE DU MOT DE PASSE AVANT ENREGISTREMENT
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

});

// MÉTHODE POUR COMPARER LE MOT DE PASSE
userSchema.methods.comparePassword = function(plain) {
    return bcrypt.compare(plain, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;