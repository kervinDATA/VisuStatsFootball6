const pool = require('../config/db');

// Contrôleur pour récupérer toutes les équipes
exports.getAllTeams = async (req, res) => {
  try {
    const query = 'SELECT * FROM dev_app_foot.dim_teams';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des équipes:', error.stack);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des équipes.' });
  }
};

// Contrôleur pour récupérer les informations basiques d'une équipe spécifique
exports.getTeamBasicInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'SELECT * FROM dev_app_foot.dim_teams WHERE team_id = $1';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Équipe non trouvée.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération des informations basiques de l\'équipe:', error.stack);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des informations basiques de l\'équipe.' });
  }
};

// Contrôleur pour récupérer les informations détaillées d'une équipe spécifique
exports.getTeamDetailedInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        t.team_id, 
        t.name, 
        t.image_path AS image, 
        t.founded,
        v.name AS stadium, 
        v.city_name AS city, 
        v.capacity
      FROM dev_app_foot.dim_teams t
      LEFT JOIN dev_app_foot.dim_venues v 
      ON t.venue_id = v.venue_id
      WHERE t.team_id = $1
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Équipe non trouvée.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération des informations détaillées de l\'équipe:', error.stack);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des informations détaillées de l\'équipe.' });
  }
};

// Contrôleur pour récupérer l'image d'une équipe
exports.getTeamImage = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'SELECT image_path FROM dev_app_foot.dim_teams WHERE team_id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Équipe non trouvée." });
    }

    const imagePath = result.rows[0].image_path;
    res.json({ image: imagePath });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'image de l'équipe :", error.stack);
    res.status(500).json({ message: "Erreur serveur lors de la récupération de l'image de l'équipe." });
  }
};
