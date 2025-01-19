const pool = require('../config/db');

// Contrôleur pour obtenir tous les scores avec les noms des saisons et des équipes
exports.getAllScores = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sc.fixture_id,
             s.season_name,
             sc.fixture_name,
             sc.fixture_result_info,
             ht.name AS home_team,
             at.name AS away_team,
             sc.home_goals,
             sc.away_goals
      FROM dev_app_foot.dim_scores sc
      LEFT JOIN dev_app_foot.dim_seasons s ON sc.season_id = s.season_id
      LEFT JOIN dev_app_foot.dim_teams ht ON sc.home_participant_id = ht.team_id
      LEFT JOIN dev_app_foot.dim_teams at ON sc.away_participant_id = at.team_id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des scores', error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
