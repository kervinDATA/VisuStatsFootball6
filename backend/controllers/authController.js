const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator'); // Importer Validator.js
const pool = require('../config/db');

// Contrôleur pour l'inscription
exports.register = async (req, res) => {
  const { email, password } = req.body;

  // Validation des entrées
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: 'Adresse email invalide' });
  }
  if (!password || !validator.isLength(password, { min: 6 })) {
    return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
  }

  try {
    const userExists = await pool.query('SELECT * FROM dev_app_foot.users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Utilisateur déjà enregistré' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO dev_app_foot.users (email, password) VALUES ($1, $2)',
      [email, hashedPassword]
    );

    res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'inscription', error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Contrôleur pour la connexion
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await pool.query('SELECT * FROM dev_app_foot.users WHERE email = $1', [email]);

    if (userExists.rows.length === 0) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    const user = userExists.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Ajouter l'ID utilisateur dans le token
    const token = jwt.sign(
      { id: user.id.trim() }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ user, token });
  } catch (err) {
    console.error('Erreur lors de la connexion:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};

// Contrôleur pour tester la base de données
exports.testDb = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dev_app_foot.users LIMIT 1');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur de connexion à la base de données', error.stack);
    res.status(500).json({ message: error.message, error: error.stack });
  }
};

// Contrôleur pour récupérer un utilisateur (route protégée)
exports.getUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await pool.query('SELECT * FROM dev_app_foot.users WHERE id = $1', [userId]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error('Erreur lors de la récupération du user', err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération du user' });
  }
};
