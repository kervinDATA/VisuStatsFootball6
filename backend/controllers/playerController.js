const pool = require('../config/db');

// Contrôleur pour récupérer tous les joueurs
exports.getAllPlayers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dev_app_foot.dim_players');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des joueurs', error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Contrôleur pour récupérer un joueur spécifique
exports.getPlayerById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM dev_app_foot.dim_players WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Joueur non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération du joueur', error.stack);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
