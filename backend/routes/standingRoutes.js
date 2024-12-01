const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Route pour récupérer le classement d'une saison spécifique
router.get('/season/:season_id', async (req, res) => {
  const { season_id } = req.params;

  try {
    const query = `
      SELECT
        ds.season_name,
        t.name AS team_name,
        s.position,
        s.points
      FROM dev_app_foot.dim_standings s
      JOIN dev_app_foot.dim_seasons ds ON s.season_id = ds.season_id
      JOIN dev_app_foot.dim_teams t ON s.participant_id = t.team_id
      WHERE s.season_id = $1
      ORDER BY s.position;
    `;
    const result = await pool.query(query, [season_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Aucun classement trouvé pour cette saison.' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération du classement de la saison', error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/team/:teamId/season/:seasonId', async (req, res) => {
  const { teamId, seasonId } = req.params;
  try {
    const query = `
      SELECT * FROM dev_app_foot.dim_standings
      WHERE team_id = $1 AND season_id = $2
    `;
    const result = await pool.query(query, [teamId, seasonId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Aucun classement trouvé pour cette équipe et cette saison.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération des standings:', error.stack);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des standings.' });
  }
});

router.get('/team/:teamId/standings', async (req, res) => {
  const { teamId } = req.params;

  try {
    const query = `
      SELECT 
        s.season_name,
        st.position,
        st.points
      FROM dev_app_foot.dim_standings st
      JOIN dev_app_foot.dim_seasons s ON st.season_id = s.season_id
      WHERE st.participant_id = $1
      ORDER BY s.season_name ASC
    `;
    const result = await pool.query(query, [teamId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Aucun classement trouvé pour cette équipe.' });
    }
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des standings :', error.stack);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des standings.' });
  }
});

module.exports = router;
