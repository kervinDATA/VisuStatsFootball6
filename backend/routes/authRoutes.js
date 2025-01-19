const express = require('express');
const {
  register,
  login,
  testDb,
  getUser,
} = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware'); // Middleware pour protéger les routes
const router = express.Router();

// Route pour l'inscription
router.post('/register', register);

// Route pour la connexion
router.post('/login', login);

// Route pour tester la base de données
router.get('/test-db', testDb);

// Route protégée pour récupérer un utilisateur
router.get('/user', verifyToken, getUser);

module.exports = router;
