const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Route pour récupérer toutes les saisons
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dev_app_foot.dim_seasons');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des saisons', error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour récupérer les informations d'une saison spécifique
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM dev_app_foot.dim_seasons WHERE season_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Saison non trouvée" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération de la saison', error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
