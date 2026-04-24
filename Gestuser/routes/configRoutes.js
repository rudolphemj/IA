const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

router.get('/fields', configController.getFields);
router.post('/fields', configController.addField);
router.delete('/fields/:key', configController.deleteField);

module.exports = router;
