const pool = require('../config/db');

// Contrôleur pour récupérer les statistiques d'attaques
exports.getAttacksStats = async (req, res) => {
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
};

// Contrôleur pour les cleansheets
exports.getCleanSheets = async (req, res) => {
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
};

// Contrôleur pour les buts par périodes
exports.getGoalsByPeriods = async (req, res) => {
  const { id } = req.params;
  const { season_id } = req.query;

  try {
    let query = `
      SELECT "0-15_count" AS goals_0_15, "15-30_count" AS goals_15_30, 
             "30-45_count" AS goals_30_45, "45-60_count" AS goals_45_60, 
             "60-75_count" AS goals_60_75, "75-90_count" AS goals_75_90 
      FROM dev_app_foot.fact_teams3 WHERE team_id = $1
    `;
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
};

// Contrôleur pour les buts globaux
exports.getGoals = async (req, res) => {
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
};

// Contrôleur pour les pénalités
exports.getPenalties = async (req, res) => {
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
};

// Contrôleur pour les tirs
exports.getShots = async (req, res) => {
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
};
