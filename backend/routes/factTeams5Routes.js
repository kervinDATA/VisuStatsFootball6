const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Route pour obtenir tous les types de statistiques disponibles dans fact_teams5
router.get('/stat-types', async (req, res) => {
  try {
    const query = 'SELECT DISTINCT type_name FROM dev_app_foot.fact_teams5';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des types de statistiques", error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



// Route pour obtenir les statistiques des pénalités sur une ou plusieurs saisons, pour une équipe spécifique ou toutes les équipes
router.get('/stats', async (req, res) => {
    const { type_name, season_names, include_rank, team_id } = req.query;
  
    if (type_name !== 'Penalties') {
      return res.status(400).json({ message: 'Veuillez fournir type_name=Penalties' });
    }
  
    try {
      // Log des paramètres reçus
      console.log("Paramètres reçus:", { type_name, season_names, include_rank, team_id });
  
      // Construire la requête de base
      let query = `
        SELECT ft.team_id, ft.type_name,
             ft.total AS penalties_total,
             ft.scored AS penalties_scored,
             ft.missed AS penalties_missed,
             ft.conversion_rate AS penalties_conversion_rate,
             ${include_rank === 'true' ? 'ft.classement,' : ''} 
             ds.season_name, dt.name AS team_name
      FROM dev_app_foot.fact_teams5 ft
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
  
      // Log de la requête et des valeurs
      console.log("Requête SQL générée:", query);
      console.log("Valeurs SQL:", values);
  
      // Exécuter la requête
      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques", error.stack);
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  });


  // Route pour obtenir le total des penalties et le nombre de but sur penalties pour une saison spécifique
  router.get('/penalty-stats', async (req, res) => {
    const { season_names } = req.query;

    if (!season_names) {
      return res.status(400).json({ message: 'Veuillez fournir une saison' });
    }

    try {
      const query = `
        SELECT 
          SUM(ft.total) AS penalties_total,
          SUM(ft.scored) AS penalties_scored
        FROM dev_app_foot.fact_teams5 ft
        JOIN dev_app_foot.dim_seasons ds ON ft.season_id = ds.season_id
        WHERE ft.type_name = 'Penalties' AND ds.season_name = $1
      `;
      const result = await pool.query(query, [season_names]);

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques des pénalités", error.stack);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  



module.exports = router;
