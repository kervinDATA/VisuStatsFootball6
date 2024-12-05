
const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Route : Statistiques corners (fact-teams1)
router.get('/stats/corners', async (req, res) => {
    const { season_name } = req.query;
  
    if (!season_name) {
      return res.status(400).json({ message: 'Paramètres manquants : season_name.' });
    }
  
    try {
      const query = `
        SELECT 
          t.name AS team_name,
          ft.count,
          ft.classement AS team_position
        FROM dev_app_foot.fact_teams1 ft
        JOIN dev_app_foot.dim_teams t ON ft.team_id = t.team_id
        JOIN dev_app_foot.dim_seasons ds ON ft.season_id = ds.season_id
        WHERE 
          ft.type_name = 'Corners' AND
          ds.season_name = $1
      `;
      const result = await pool.query(query, [season_name]);
      res.json(result.rows);
    } catch (error) {
      console.error('Erreur SQL (stats/corners) :', error.stack);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  });

  // Route : Statistiques attacks (fact-teams1)
  router.get('/stats/attacks', async (req, res) => {
    const { season_name } = req.query;
  
    if (!season_name) {
      return res.status(400).json({ message: 'Paramètres manquants : season_name.' });
    }
  
    try {
      const query = `
        SELECT 
          t.name AS team_name,
          ft.count,
          ft.classement AS team_position
        FROM dev_app_foot.fact_teams1 ft
        JOIN dev_app_foot.dim_teams t ON ft.team_id = t.team_id
        JOIN dev_app_foot.dim_seasons ds ON ft.season_id = ds.season_id
        WHERE 
          ft.type_name = 'Attacks' AND
          ds.season_name = $1
      `;
      const result = await pool.query(query, [season_name]);
      res.json(result.rows);
    } catch (error) {
      console.error('Erreur SQL (stats/attacks) :', error.stack);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  });


  // Route : Statistiques dangerous-attacks (fact-teams1)
  router.get('/stats/dangerous-attacks', async (req, res) => {
    const { season_name } = req.query;
  
    if (!season_name) {
      return res.status(400).json({ message: 'Paramètres manquants : season_name.' });
    }
  
    try {
      const query = `
        SELECT 
          t.name AS team_name,
          ft.count,
          ft.classement AS team_position
        FROM dev_app_foot.fact_teams1 ft
        JOIN dev_app_foot.dim_teams t ON ft.team_id = t.team_id
        JOIN dev_app_foot.dim_seasons ds ON ft.season_id = ds.season_id
        WHERE 
          ft.type_name = 'Dangerous Attacks' AND
          ds.season_name = $1
      `;
      const result = await pool.query(query, [season_name]);
      res.json(result.rows);
    } catch (error) {
      console.error('Erreur SQL (stats/dangerous-attacks) :', error.stack);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  });



  // Route : Statistiques Ball Possession % (fact-teams1)
  router.get('/stats/possession', async (req, res) => {
    const { season_name } = req.query;
  
    if (!season_name) {
      return res.status(400).json({ message: 'Paramètres manquants : season_name.' });
    }
  
    try {
      const query = `
        SELECT 
          t.name AS team_name,
          ft.count,
          ft.classement AS team_position
        FROM dev_app_foot.fact_teams1 ft
        JOIN dev_app_foot.dim_teams t ON ft.team_id = t.team_id
        JOIN dev_app_foot.dim_seasons ds ON ft.season_id = ds.season_id
        WHERE 
          ft.type_name = 'Ball Possession %' AND
          ds.season_name = $1
      `;
      const result = await pool.query(query, [season_name]);
      res.json(result.rows);
    } catch (error) {
      console.error('Erreur SQL (stats/possession) :', error.stack);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  });

  // Route : Statistiques wins (fact-teams2)
  router.get('/stats/wins', async (req, res) => {
    const { season_name } = req.query;
  
    if (!season_name) {
      return res.status(400).json({ message: 'Paramètres manquants : season_name.' });
    }
  
    try {
      const query = `
        SELECT 
          t.name AS team_name,
          ft.all_count AS total_wins,
          ft.classement AS team_position
        FROM dev_app_foot.fact_teams2 ft
        JOIN dev_app_foot.dim_teams t ON ft.team_id = t.team_id
        JOIN dev_app_foot.dim_seasons ds ON ft.season_id = ds.season_id
        WHERE 
          ft.type_name = 'Team Wins' AND
          ds.season_name = $1
      `;
      const result = await pool.query(query, [season_name]);
      res.json(result.rows);
    } catch (error) {
      console.error('Erreur SQL (stats/possession) :', error.stack);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  });

  // Route : Statistiques lost (fact-teams2)
  router.get('/stats/lost', async (req, res) => {
    const { season_name } = req.query;
  
    if (!season_name) {
      return res.status(400).json({ message: 'Paramètres manquants : season_name.' });
    }
  
    try {
      const query = `
        SELECT 
          t.name AS team_name,
          ft.all_count AS total_lost,
          ft.classement AS team_position
        FROM dev_app_foot.fact_teams2 ft
        JOIN dev_app_foot.dim_teams t ON ft.team_id = t.team_id
        JOIN dev_app_foot.dim_seasons ds ON ft.season_id = ds.season_id
        WHERE 
          ft.type_name = 'Team Lost' AND
          ds.season_name = $1
      `;
      const result = await pool.query(query, [season_name]);
      res.json(result.rows);
    } catch (error) {
      console.error('Erreur SQL (stats/possession) :', error.stack);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  });

  // Route : Statistiques draw (fact-teams2)
  router.get('/stats/draw', async (req, res) => {
    const { season_name } = req.query;
  
    if (!season_name) {
      return res.status(400).json({ message: 'Paramètres manquants : season_name.' });
    }
  
    try {
      const query = `
        SELECT 
          t.name AS team_name,
          ft.all_count AS total_draw,
          ft.classement AS team_position
        FROM dev_app_foot.fact_teams2 ft
        JOIN dev_app_foot.dim_teams t ON ft.team_id = t.team_id
        JOIN dev_app_foot.dim_seasons ds ON ft.season_id = ds.season_id
        WHERE 
          ft.type_name = 'Team Draws' AND
          ds.season_name = $1
      `;
      const result = await pool.query(query, [season_name]);
      res.json(result.rows);
    } catch (error) {
      console.error('Erreur SQL (stats/possession) :', error.stack);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  });

  // Route : Répartition des buts par intervalle de temps pour toutes les équipes
  router.get('/scoring-intervals', async (req, res) => {
    const { season_name } = req.query;
  
    if (!season_name) {
      return res.status(400).json({ message: 'Paramètres manquants : season_name.' });
    }
  
    try {
      const query = `
        SELECT 
          team_name,
          interval_time,
          goals_percentage
        FROM (
          SELECT 
              t.name AS team_name,
              '0-15' AS interval_time,
              ft3."0-15_percentage" AS goals_percentage
          FROM 
              dev_app_foot.fact_teams3 ft3
          JOIN 
              dev_app_foot.dim_teams t ON ft3.team_id = t.team_id
          JOIN 
              dev_app_foot.dim_seasons ds ON ft3.season_id = ds.season_id
          WHERE 
              ds.season_name = $1
              AND ft3.type_name = 'Scoring Minutes'
  
          UNION ALL
  
          SELECT 
              t.name AS team_name,
              '15-30' AS interval_time,
              ft3."15-30_percentage" AS goals_percentage
          FROM 
              dev_app_foot.fact_teams3 ft3
          JOIN 
              dev_app_foot.dim_teams t ON ft3.team_id = t.team_id
          JOIN 
              dev_app_foot.dim_seasons ds ON ft3.season_id = ds.season_id
          WHERE 
              ds.season_name = $1
              AND ft3.type_name = 'Scoring Minutes'
  
          UNION ALL
  
          SELECT 
              t.name AS team_name,
              '30-45' AS interval_time,
              ft3."30-45_percentage" AS goals_percentage
          FROM 
              dev_app_foot.fact_teams3 ft3
          JOIN 
              dev_app_foot.dim_teams t ON ft3.team_id = t.team_id
          JOIN 
              dev_app_foot.dim_seasons ds ON ft3.season_id = ds.season_id
          WHERE 
              ds.season_name = $1
              AND ft3.type_name = 'Scoring Minutes'
  
          UNION ALL
  
          SELECT 
              t.name AS team_name,
              '45-60' AS interval_time,
              ft3."45-60_percentage" AS goals_percentage
          FROM 
              dev_app_foot.fact_teams3 ft3
          JOIN 
              dev_app_foot.dim_teams t ON ft3.team_id = t.team_id
          JOIN 
              dev_app_foot.dim_seasons ds ON ft3.season_id = ds.season_id
          WHERE 
              ds.season_name = $1
              AND ft3.type_name = 'Scoring Minutes'
  
          UNION ALL
  
          SELECT 
              t.name AS team_name,
              '60-75' AS interval_time,
              ft3."60-75_percentage" AS goals_percentage
          FROM 
              dev_app_foot.fact_teams3 ft3
          JOIN 
              dev_app_foot.dim_teams t ON ft3.team_id = t.team_id
          JOIN 
              dev_app_foot.dim_seasons ds ON ft3.season_id = ds.season_id
          WHERE 
              ds.season_name = $1
              AND ft3.type_name = 'Scoring Minutes'
  
          UNION ALL
  
          SELECT 
              t.name AS team_name,
              '75-90' AS interval_time,
              ft3."75-90_percentage" AS goals_percentage
          FROM 
              dev_app_foot.fact_teams3 ft3
          JOIN 
              dev_app_foot.dim_teams t ON ft3.team_id = t.team_id
          JOIN 
              dev_app_foot.dim_seasons ds ON ft3.season_id = ds.season_id
          WHERE 
              ds.season_name = $1
              AND ft3.type_name = 'Scoring Minutes'
        ) AS intervals
        ORDER BY team_name, interval_time;
      `;
  
      const result = await pool.query(query, [season_name]);
      res.json(result.rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des intervalles de buts :', error.stack);
      res.status(500).json({ message: 'Erreur serveur', details: error.message });
    }
  });



module.exports = router;
