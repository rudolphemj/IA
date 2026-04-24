// app.js
const express = require('express');
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Route GET
app.get('/', (req, res) => {
    res.send('🌍 Hello depuis Express');
});

// Route POST
app.post('/data', (req, res) => {
    res.json({ reçu: req.body });
});

app.listen(3000, () => {
    console.log('🚀 Serveur Express sur http://localhost:3000');
});