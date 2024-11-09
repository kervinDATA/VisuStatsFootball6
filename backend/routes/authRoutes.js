const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const verifyToken = require('../middleware/authMiddleware'); // Importer le middleware
const router = express.Router();

// Route POST pour l'inscription
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const userExists = await pool.query('SELECT * FROM dev_app_foot.users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Utilisateur déjà enregistré' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer le nouvel utilisateur
    await pool.query(
      'INSERT INTO dev_app_foot.users (email, password) VALUES ($1, $2)',
      [email, hashedPassword]
    );

    res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'inscription', error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Endpoint de connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier les identifiants de l'utilisateur dans la base de données
    const userExists = await pool.query('SELECT * FROM dev_app_foot.users WHERE email = $1', [email]);
    if (userExists.rows.length === 0) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    // Comparer le mot de passe
    const user = userExists.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }


    // Générer un token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

     // Si la connexion réussit, renvoie le token et les informations de l'utilisateur
     res.status(200).json({ user, token });
    } catch (err) {
        console.error('Erreur lors de la connexion:', err);
        res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
    }
});



// Test de la base de données
router.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dev_app_foot.users LIMIT 1');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur de connexion à la base de données', error.stack);
    res.status(500).json({ message: error.message, error: error.stack });
  }
});


// Route protégée exemple
router.get('/user', verifyToken, async (req, res) => {
  // accéder à req.userId, qui contient l'ID de l'utilisateur
  try {
      const userId = req.userId; // L'ID de l'utilisateur
      const user = await pool.query('SELECT * FROM dev_app_foot.users WHERE id = $1', [userId]);
      res.json(user.rows[0]);
  } catch (err) {
      console.error('Erreur lors de la récupération du user', err);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération du user' });
  }
});




// Exporter le router
module.exports = router;
