const pool = require('../config/db');

// Contrôleur pour récupérer les statistiques des corners
exports.getCornersStats = async (req, res) => {
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
};

// Contrôleur pour récupérer les statistiques des attaques
exports.getAttacksStats = async (req, res) => {
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
};

// Contrôleur pour récupérer les statistiques des attaques dangereuses
exports.getDangerousAttacksStats = async (req, res) => {
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
};

// Contrôleur pour récupérer les statistiques de possession
exports.getPossessionStats = async (req, res) => {
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
};

// Contrôleur pour récupérer les statistiques des victoires
exports.getWinsStats = async (req, res) => {
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
    console.error('Erreur SQL (stats/wins) :', error.stack);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Contrôleur pour récupérer les statistiques des défaites
exports.getLostStats = async (req, res) => {
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
};

// Contrôleur pour récupérer les statistiques des matchs nuls
exports.getDrawStats = async (req, res) => {
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
};

// Contrôleur pour récupérer les statistiques scoring minutes
exports.getScoringIntervalsStats =async (req, res) => {
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
};

// Contrôleur pour sauvegarder une analyse utilisateur
exports.saveUserAnalysis = async (req, res) => {
  const { name, charts, user_id } = req.body;

  if (!name || !charts || !user_id) {
    return res.status(400).json({ message: 'Paramètres manquants : name, charts, ou user_id.' });
  }

  try {
    const query = `
      INSERT INTO dev_app_foot.user_saved_analyses (name, charts, user_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await pool.query(query, [name, JSON.stringify(charts), user_id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'analyse utilisateur :', error.stack);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Contrôleur pour récupérer les analyses sauvegardées
exports.getSavedAnalyses = async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({ message: 'Paramètre manquant : user_id.' });
  }

  try {
    const query = `
      SELECT * FROM dev_app_foot.user_saved_analyses
      WHERE user_id = $1
      ORDER BY id DESC;
    `;
    const result = await pool.query(query, [user_id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des analyses sauvegardées :', error.stack);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Contrôleur pour mettre à jour une analyse utilisateur
exports.updateAnalysis = async (req, res) => {
  const { id } = req.params;
  const { name, charts, user_id } = req.body;

  if (!id || !name || !charts || !user_id) {
    return res.status(400).json({ message: 'Paramètres manquants : id, name, charts, ou user_id.' });
  }

  try {
    const query = `
      UPDATE dev_app_foot.user_saved_analyses
      SET name = $1, charts = $2, user_id = $3
      WHERE id = $4
      RETURNING *;
    `;
    const result = await pool.query(query, [name, JSON.stringify(charts), user_id, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Analyse non trouvée.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'analyse utilisateur :', error.stack);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Contrôleur pour supprimer une analyse utilisateur
exports.deleteAnalysis = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Paramètre manquant : id.' });
  }

  try {
    const query = `
      DELETE FROM dev_app_foot.user_saved_analyses
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Analyse non trouvée.' });
    }
    res.json({ message: 'Analyse supprimée avec succès.', deletedAnalysis: result.rows[0] });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'analyse utilisateur :', error.stack);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
