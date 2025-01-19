const pool = require('../config/db');

// Contrôleur pour récupérer toutes les informations des lieux
exports.getAllVenues = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT venue_id, city_name, name AS venue_name, address, latitude, longitude, capacity, image_path, surface
      FROM dev_app_foot.dim_venues
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des lieux', error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
