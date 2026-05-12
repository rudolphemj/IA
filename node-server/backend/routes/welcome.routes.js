const express = require('express');
const controller = require('../controllers/welcome.controller');

const router = express.Router();

router.get('/welcome', controller.welcome);

module.exports = router;
