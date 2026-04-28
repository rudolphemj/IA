
const express = require('express');
const path = require('path');

const app = express();

// ✅ autoriser les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));



app.listen(3000, () => {
  console.log('Serveur sur http://localhost:3000');
});
