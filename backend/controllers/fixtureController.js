const pool = require('../config/db');

// Contrôleur pour récupérer les fixtures avec différents filtres
exports.getFixtures = async (req, res) => {
  const { season_name, date, venue, team, outcome } = req.query;

  try {
    let query = `
      SELECT f.fixture_id,
             f.fixture_name,
             f.round_starting_at,
             f.round_ending_at,
             f.fixture_start_time,
             f.fixture_result_info,
             s.season_name,                    
             v.name AS venue_name,             
             v.city_name,
             ht.name AS home_team,             
             at.name AS away_team,             
             sc.home_goals,
             sc.away_goals,
             f.is_home_winner,
             f.is_away_winner,
             f.is_draw
      FROM dev_app_foot.dim_fixtures f
      LEFT JOIN dev_app_foot.dim_seasons s ON f.season_id = s.season_id
      LEFT JOIN dev_app_foot.dim_venues v ON f.fixture_venue_id = v.venue_id
      LEFT JOIN dev_app_foot.dim_teams ht ON f.home_participant = ht.team_id
      LEFT JOIN dev_app_foot.dim_teams at ON f.away_participant = at.team_id
      LEFT JOIN dev_app_foot.dim_scores sc ON f.fixture_id = sc.fixture_id
      WHERE 1=1
    `;

    const values = [];
    let count = 1;

    if (season_name) {
      query += ` AND s.season_name = $${count}`;
      values.push(season_name);
      count++;
    }

    if (date) {
      query += ` AND DATE(f.round_starting_at) = $${count}`;
      values.push(date);
      count++;
    }

    if (venue) {
      query += ` AND v.name ILIKE $${count}`;
      values.push(`%${venue}%`);
      count++;
    }

    if (team) {
      query += ` AND (ht.name ILIKE $${count} OR at.name ILIKE $${count})`;
      values.push(`%${team}%`);
      count++;
    }

    if (outcome) {
      if (outcome === 'home_win') query += ' AND f.is_home_winner = TRUE';
      else if (outcome === 'away_win') query += ' AND f.is_away_winner = TRUE';
      else if (outcome === 'draw') query += ' AND f.is_draw = TRUE';
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des fixtures', error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
