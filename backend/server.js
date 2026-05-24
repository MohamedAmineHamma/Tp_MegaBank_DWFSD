require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ConnectDB = require('./config/db');
const seedAdmin = require('./seed');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/comptes', require('./routes/compte.routes'));
app.use('/api/virements', require('./routes/virement.routes'));
app.use('/api/transactions', require('./routes/transactions.routes'));


app.use((req, res) => {
    res.status(404).json({ message: 'Route introuvable' });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erreur interne du serveur' });
});

const PORT = process.env.PORT || 4000;

(async () => {
    await ConnectDB();
    await seedAdmin();
    app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
})();