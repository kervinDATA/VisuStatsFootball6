const db = require('../config/db');

// Contrôleur pour récupérer les statistiques globales
exports.getGlobalStatistics = async (req, res) => {
  try {
    const totalUsersQuery = 'SELECT COUNT(*) AS totalusers FROM dev_app_foot.users';
    const totalAnalysesQuery = 'SELECT COUNT(*) AS totalanalyses FROM dev_app_foot.user_saved_analyses';

    // Exécution des requêtes SQL
    const totalUsersResult = await db.query(totalUsersQuery);
    const totalAnalysesResult = await db.query(totalAnalysesQuery);

    // Conversion des résultats en nombres
    res.json({
      totalUsers: parseInt(totalUsersResult.rows[0]?.totalusers || 0, 10),
      totalAnalyses: parseInt(totalAnalysesResult.rows[0]?.totalanalyses || 0, 10),
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques globales :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques.' });
  }
};
