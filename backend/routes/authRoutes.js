const express = require('express');
const { register, login, testDb, getUser } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware'); // Middleware pour protéger les routes
const validator = require('validator'); // Importer Validator.js
const router = express.Router();

// Middleware pour valider les entrées utilisateur
const validateRegister = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: 'Adresse email invalide' });
  }
  if (!password || !validator.isLength(password, { min: 6 })) {
    return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
  }
  next(); // Si tout est valide, passer au contrôleur
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: 'Adresse email invalide' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Le mot de passe est requis' });
  }
  next(); // Si tout est valide, passer au contrôleur
};

// Route pour l'inscription avec validation
router.post('/register', validateRegister, register);

// Route pour la connexion avec validation
router.post('/login', validateLogin, login);

// Route pour tester la base de données
router.get('/test-db', testDb);

// Route protégée pour récupérer un utilisateur
router.get('/user', verifyToken, getUser);

module.exports = router;
