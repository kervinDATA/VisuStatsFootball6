const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Route pour obtenir tous les types de statistiques disponibles dans fact_teams3
router.get('/stat-types', async (req, res) => {
  try {
    const query = 'SELECT DISTINCT type_name FROM dev_app_foot.fact_teams3';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des types de statistiques", error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



// Route pour obtenir les statistiques pour un type spécifique sur une ou plusieurs saisons, pour une équipe spécifique ou toutes les équipes
router.get('/stats', async (req, res) => {
  const { type_name, season_names, include_rank, team_id } = req.query;

  if (!type_name) {
    return res.status(400).json({ message: 'Veuillez fournir un type_name' });
  }

  try {
    // Log des paramètres reçus
    console.log("Paramètres reçus:", { type_name, season_names, include_rank, team_id });

    // Construire la requête de base
    let query = `
      SELECT ft.team_id, ft.type_name,
             ft."0-15_count" AS goals_0_15, ft."0-15_percentage" AS goals_0_15_pct,
             ft."15-30_count" AS goals_15_30, ft."15-30_percentage" AS goals_15_30_pct,
             ft."30-45_count" AS goals_30_45, ft."30-45_percentage" AS goals_30_45_pct,
             ft."45-60_count" AS goals_45_60, ft."45-60_percentage" AS goals_45_60_pct,
             ft."60-75_count" AS goals_60_75, ft."60-75_percentage" AS goals_60_75_pct,
             ft."75-90_count" AS goals_75_90, ft."75-90_percentage" AS goals_75_90_pct,
             ${include_rank === 'true' ? 'ft.classement,' : ''} 
             ds.season_name, dt.name AS team_name
      FROM dev_app_foot.fact_teams3 ft
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


// Route pour obtenir le nombre de buts par tranche de 15 minutes pour une saison spécifique
router.get('/goals-per-15min', async (req, res) => {
  const { season_names } = req.query;

  if (!season_names) {
    return res.status(400).json({ message: 'Veuillez fournir une saison' });
  }

  try {
    const query = `
      SELECT 
        SUM(ft."0-15_count") AS goals_0_15,
        SUM(ft."15-30_count") AS goals_15_30,
        SUM(ft."30-45_count") AS goals_30_45,
        SUM(ft."45-60_count") AS goals_45_60,
        SUM(ft."60-75_count") AS goals_60_75,
        SUM(ft."75-90_count") AS goals_75_90
      FROM dev_app_foot.fact_teams3 ft
      JOIN dev_app_foot.dim_seasons ds ON ft.season_id = ds.season_id
      WHERE ds.season_name = $1
    `;
    const result = await pool.query(query, [season_names]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération des buts par tranche de 15 minutes", error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



module.exports = router;
