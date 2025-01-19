const pool = require('../config/db');

// Contrôleur pour obtenir tous les types de statistiques disponibles
exports.getStatTypes = async (req, res) => {
  try {
    const query = 'SELECT DISTINCT type_name FROM dev_app_foot.fact_teams4';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des types de statistiques", error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Contrôleur pour obtenir les statistiques pour un type spécifique
exports.getStats = async (req, res) => {
  const { type_name, season_names, include_rank, team_id } = req.query;

  if (!type_name) {
    return res.status(400).json({ message: 'Veuillez fournir un type_name' });
  }

  try {
    console.log("Paramètres reçus:", { type_name, season_names, include_rank, team_id });

    let query = `
      SELECT ft.team_id, ft.type_name,
           ft.all_count AS goals_total, ft.all_average AS goals_average,
           ft.all_firsthalf_pct AS goals_firsthalf_percentage,
           ft.home_count AS home_goals_total, ft.home_percentage AS home_goals_percentage,
           ft.home_average AS home_goals_average, ft.home_firsthalf_pct AS home_goals_firsthalf_percentage,
           ft.away_count AS away_goals_total, ft.away_percentage AS away_goals_percentage,
           ft.away_average AS away_goals_average, ft.away_firsthalf_pct AS away_goals_firsthalf_percentage,
           ${include_rank === 'true' ? 'ft.classement,' : ''} 
           ds.season_name, dt.name AS team_name
      FROM dev_app_foot.fact_teams4 ft
      JOIN dev_app_foot.dim_seasons ds ON ft.season_id = ds.season_id
      JOIN dev_app_foot.dim_teams dt ON ft.team_id = dt.team_id
      WHERE ft.type_name = $1
    `;
    const values = [type_name];

    if (season_names) {
      const seasonList = season_names.split(',').map(name => name.trim());
      const seasonPlaceholders = seasonList.map((_, index) => `$${index + 2}`).join(', ');
      query += ` AND ds.season_name IN (${seasonPlaceholders})`;
      values.push(...seasonList);
    }

    if (team_id) {
      query += ` AND ft.team_id = $${values.length + 1}`;
      values.push(team_id);
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques", error.stack);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Contrôleur pour obtenir le nombre total de buts d'une ou plusieurs saisons spécifiques
exports.getTotalGoals = async (req, res) => {
  const { season_names } = req.query;

  if (!season_names) {
    return res.status(400).json({ message: 'Veuillez fournir une ou plusieurs saisons' });
  }

  const seasonList = Array.isArray(season_names) ? season_names : [season_names];
  const placeholders = seasonList.map((_, i) => `$${i + 1}`).join(', ');

  try {
    const query = `
      SELECT SUM(ft.all_count) AS total_goals
      FROM dev_app_foot.fact_teams4 ft
      JOIN dev_app_foot.dim_seasons ds ON ft.season_id = ds.season_id
      WHERE ft.type_name = 'Goals' AND ds.season_name IN (${placeholders})
    `;
    const result = await pool.query(query, seasonList);

    res.json({ total_goals: result.rows[0]?.total_goals || 0 });
  } catch (error) {
    console.error("Erreur lors de la récupération du nombre total de buts", error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
