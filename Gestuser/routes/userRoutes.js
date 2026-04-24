const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ✅ POST
router.post('/users', userController.createUser);

// ✅ GET
router.get('/users', userController.getUsers);

// ✅ UPDATE
router.put('/users/:id', userController.updateUser);

// ✅ DELETE
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
