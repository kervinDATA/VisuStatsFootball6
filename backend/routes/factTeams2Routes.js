const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Route pour obtenir tous les types de statistiques disponibles dans fact_teams2
router.get('/stat-types', async (req, res) => {
  try {
    const query = 'SELECT DISTINCT type_name FROM dev_app_foot.fact_teams2';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des types de statistiques", error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// Route pour obtenir les statistiques pour un type spécifique sur une ou plusieurs saisons
router.get('/stats', async (req, res) => {
    const { type_name, season_names, include_rank, team_id } = req.query;
  
    if (!type_name) {
      return res.status(400).json({ message: 'Veuillez fournir un type_name' });
    }
  
    try {
      // Construire la requête de base
      let query = `
        SELECT ft.team_id, ft.type_name,
             ft.all_count AS total_count, ft.all_percentage AS total_percentage,
             ft.home_count AS home_total, ft.home_percentage AS home_percentage,
             ft.away_count AS away_total, ft.away_percentage AS away_percentage,
             ${include_rank === 'true' ? 'ft.classement,' : ''} 
             ds.season_name, dt.name AS team_name
      FROM dev_app_foot.fact_teams2 ft
      JOIN dev_app_foot.dim_seasons ds ON ft.season_id = ds.season_id
      JOIN dev_app_foot.dim_teams dt ON ft.team_id = dt.team_id
      WHERE ft.type_name = $1
      `;
      const values = [type_name];
  
      // Gérer le filtre sur les season_name si spécifié
      if (season_names) {
        const seasonList = season_names.split(',').map(name => name.trim());
        const seasonPlaceholders = seasonList.map((_, index) => `$${index + 2}`).join(', ');
        query += ` AND ds.season_name IN (${seasonPlaceholders})`;
        values.push(...seasonList);
      }


      // Gérer le filtre sur team_id si spécifié
      if (team_id) {
        query += ` AND ft.team_id = $${values.length + 1}`;
        values.push(team_id);
      }

      
  
      // Exécuter la requête
      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques", error.stack);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });




module.exports = router;
