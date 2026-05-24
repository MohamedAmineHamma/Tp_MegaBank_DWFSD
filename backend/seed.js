const User = require('./models/User');

module.exports = async function seedAdmin() {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const existingAdmin = await User.findOne({ email : adminEmail });
        if (existingAdmin) {
            return console.log('Admin déjà existant');
        }
        await User.create({ nom: 'DWFSD',
                   email: adminEmail,
                   password: adminPassword,
                   role: 'ADMIN' });
        console.log('Admin créé avec succès');
};      