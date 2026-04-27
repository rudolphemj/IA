const express = require('express');
const router = express.Router();
const path = require("path"); // ✅ OBLIGATOIRE
const userController = require('../controllers/userController');

// ✅ POST
router.post('/users', userController.createUser);

// ✅ GET
router.get('/users', userController.getUsers);

// ✅ UPDATE
router.put('/users/:id', userController.updateUser);

// ✅ DELETE
router.delete('/users/:id', userController.deleteUser);

// 👉 TELECHARGEMENT

router.get("/download", (req, res) => {
  const filePath = path.join(
    __dirname,
    "../data/users.json"
  );

  res.download(filePath, "users.json", err => {
    if (err) {
      console.error(err);
      res.status(500).send("Erreur lors du téléchargement");
    }
  });
});



module.exports = router;
