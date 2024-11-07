const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const router = express.Router();

// Route POST pour l'inscription
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    //const userExists = await pool.query('SELECT * FROM "dev_app_foot"."users" WHERE email = $1', [email]);
    const userExists = await pool.query('SELECT * FROM dev_app_foot.users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Utilisateur déjà enregistré' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer le nouvel utilisateur
    await pool.query(
      'INSERT INTO  dev_app_foot.users (email, password) VALUES ($1, $2)',
      [email, hashedPassword]
    );

    res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'inscription', error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/test-db', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM dev_app_foot.users LIMIT 1');
      res.json(result.rows);
    } catch (error) {
      console.error('Erreur de connexion à la base de données', error.stack);
      res.status(500).json({ message: error.message, error: error.stack });
    }
  });


module.exports = router;
