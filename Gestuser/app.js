const express = require('express');
const app = express();

app.use(express.json());

// Routes
app.use('/api', require('./routes/userRoutes'));
app.use('/api/config', require('./routes/configRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use(express.static('public'));

app.listen(3000, () => {
  console.log('🚀 Serveur démarré sur http://localhost:3000');
});