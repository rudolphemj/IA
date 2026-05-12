const express = require('express');
const welcomeRoutes = require('./welcome.routes');

const router = express.Router();

router.use(welcomeRoutes);

module.exports = router;
