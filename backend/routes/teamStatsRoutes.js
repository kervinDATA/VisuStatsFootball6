const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Route pour obtenir les statistiques d'attaques (fact_teams1)
router.get('/:id/attacks', async (req, res) => {
  const { id } = req.params;
  const { season_id } = req.query;

  try {
    let query = 'SELECT count, average FROM dev_app_foot.fact_teams1 WHERE team_id = $1';
    const values = [id];

    if (season_id) {
      query += ' AND season_id = $2';
      values.push(season_id);
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques d'attaques", error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour les cleansheets (fact_teams2)
router.get('/:id/cleansheets', async (req, res) => {
  const { id } = req.params;
  const { season_id } = req.query;

  try {
    let query = 'SELECT all_count AS cleansheets, all_percentage AS cleansheet_pct FROM dev_app_foot.fact_teams2 WHERE team_id = $1';
    const values = [id];

    if (season_id) {
      query += ' AND season_id = $2';
      values.push(season_id);
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des cleansheets", error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour les buts par période (fact_teams3)
router.get('/:id/goals_periods', async (req, res) => {
  const { id } = req.params;
  const { season_id } = req.query;

  try {
    let query = `
      SELECT "0-15_count" AS goals_0_15, "15-30_count" AS goals_15_30, 
             "30-45_count" AS goals_30_45, "45-60_count" AS goals_45_60, 
             "60-75_count" AS goals_60_75, "75-90_count" AS goals_75_90 
      FROM dev_app_foot.fact_teams3 WHERE team_id = $1`;
    const values = [id];

    if (season_id) {
      query += ' AND season_id = $2';
      values.push(season_id);
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des buts par période", error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour les buts globaux (fact_teams4)
router.get('/:id/goals', async (req, res) => {
  const { id } = req.params;
  const { season_id } = req.query;

  try {
    let query = 'SELECT all_count AS goals, all_average AS avg_goals FROM dev_app_foot.fact_teams4 WHERE team_id = $1';
    const values = [id];

    if (season_id) {
      query += ' AND season_id = $2';
      values.push(season_id);
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des buts globaux", error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour les pénalités (fact_teams5)
router.get('/:id/penalties', async (req, res) => {
  const { id } = req.params;
  const { season_id } = req.query;

  try {
    let query = 'SELECT total AS penalties_total, scored AS penalties_scored FROM dev_app_foot.fact_teams5 WHERE team_id = $1';
    const values = [id];

    if (season_id) {
      query += ' AND season_id = $2';
      values.push(season_id);
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des pénalités", error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour les tirs (fact_teams6)
router.get('/:id/shots', async (req, res) => {
  const { id } = req.params;
  const { season_id } = req.query;

  try {
    let query = 'SELECT total AS shots_total, inside_box AS shots_inside_box FROM dev_app_foot.fact_teams6 WHERE team_id = $1';
    const values = [id];

    if (season_id) {
      query += ' AND season_id = $2';
      values.push(season_id);
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des tirs", error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
