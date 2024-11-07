const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Route pour récupérer tous les matchs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dev_app_foot.dim_fixtures');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des matchs', error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour récupérer les informations d'un match spécifique
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM dev_app_foot.dim_fixtures WHERE fixture_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Match non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération du match', error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
