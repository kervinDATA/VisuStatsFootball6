const pool = require('../config/db');

// Contrôleur pour récupérer les saisons
exports.getSeasons = async (req, res) => {
  try {
    const query = `
      SELECT season_id, season_name
      FROM dev_app_foot.dim_seasons
      ORDER BY season_name DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des saisons :', error.stack);
    res.status(500).json({ message: 'Erreur serveur', details: error.message });
  }
};

// Contrôleur pour récupérer les statistiques de possession et de classement
exports.getBallPossessionStats = async (req, res) => {
  const { season_name } = req.query;

  if (!season_name) {
    return res.status(400).json({ message: 'Veuillez fournir un season_name' });
  }

  try {
    const query = `
      SELECT 
        ft.team_id,
        CONCAT(ft.average, ' %') AS ball_possession,
        ft.classement AS team_position,
        dt.name AS team_name
      FROM dev_app_foot.fact_teams1 ft
      JOIN dev_app_foot.dim_seasons ds ON ft.season_id = ds.season_id
      JOIN dev_app_foot.dim_teams dt ON ft.team_id = dt.team_id
      WHERE ft.type_name = 'Ball Possession %'
        AND ds.season_name = $1
      ORDER BY ft.classement ASC;
    `;
    const result = await pool.query(query, [season_name]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques :', error.stack);
    res.status(500).json({ message: 'Erreur serveur', details: error.message });
  }
};

// Contrôleur pour récupérer les statistiques d'attaques dangereuses et buts
exports.getDangerousAttacksStats = async (req, res) => {
  const { season_name } = req.query;

  if (!season_name) {
    return res.status(400).json({ message: 'Veuillez fournir un season_name' });
  }

  try {
    const query = `
      SELECT 
        t.team_id,
        t.name AS team_name,
        ft1.count AS dangerous_attacks,
        ft4.all_count AS goals_scored,
        ft4.classement AS team_position,
        ds.season_name
      FROM 
        dev_app_foot.dim_teams t
      JOIN 
        dev_app_foot.fact_teams1 ft1 ON t.team_id = ft1.team_id
      LEFT JOIN 
        dev_app_foot.fact_teams4 ft4 ON t.team_id = ft4.team_id AND ft4.season_id = ft1.season_id
      LEFT JOIN 
        dev_app_foot.dim_seasons ds ON ft4.season_id = ds.season_id
      WHERE 
        ft1.type_name = 'Dangerous Attacks'
        AND ft4.type_name = 'Goals'
        AND ds.season_name = $1
      ORDER BY 
        ft4.classement ASC;
    `;
    const result = await pool.query(query, [season_name]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques :', error.stack);
    res.status(500).json({ message: 'Erreur serveur', details: error.message });
  }
};

// Contrôleur pour récupérer la répartition des buts par intervalle de temps
exports.getGoalsIntervalDistribution = async (req, res) => {
  const { season_name } = req.query;

  if (!season_name) {
    return res.status(400).json({ message: 'Veuillez fournir un season_name' });
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
            t.name IN ('Celtic', 'Rangers') 
            AND ds.season_name = $1
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
            t.name IN ('Celtic', 'Rangers') 
            AND ds.season_name = $1
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
            t.name IN ('Celtic', 'Rangers') 
            AND ds.season_name = $1
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
            t.name IN ('Celtic', 'Rangers') 
            AND ds.season_name = $1
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
            t.name IN ('Celtic', 'Rangers') 
            AND ds.season_name = $1
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
            t.name IN ('Celtic', 'Rangers') 
            AND ds.season_name = $1
            AND ft3.type_name = 'Scoring Minutes'
      ) AS intervals
      ORDER BY team_name, interval_time;
    `;
    const result = await pool.query(query, [season_name]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la répartition des buts :', error.stack);
    res.status(500).json({ message: 'Erreur serveur', details: error.message });
  }
};
