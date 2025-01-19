const pool = require('../config/db');

// Contrôleur pour obtenir tous les types de statistiques disponibles
exports.getStatTypes = async (req, res) => {
  try {
    const query = 'SELECT DISTINCT type_name FROM dev_app_foot.fact_teams1';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des types de statistiques", error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Contrôleur pour obtenir les statistiques d'un type spécifique
exports.getStats = async (req, res) => {
  const { type_name, season_names, include_rank, team_id } = req.query;

  if (!type_name) {
    return res.status(400).json({ message: 'Veuillez fournir un type_name' });
  }

  try {
    console.log("Paramètres reçus:", { type_name, season_names, include_rank, team_id });

    let query = `
      SELECT ft.team_id, ft.type_name, ft.count, ft.average,
             ${include_rank === 'true' ? 'ft.classement,' : ''} 
             ds.season_name, dt.name AS team_name
      FROM dev_app_foot.fact_teams1 ft
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
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Contrôleur pour obtenir la possession de balle et classement pour une saison
exports.getBallPossession = async (req, res) => {
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
    console.error('Erreur lors de la récupération des données :', error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
