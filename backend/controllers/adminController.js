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

// Contrôleur pour récupérer les utilisateurs
exports.getUsers = async (req, res) => {
  try {
    const query = 'SELECT id, email, role FROM dev_app_foot.users';
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
  }
};

// Contrôleur pour supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Récupère l'ID depuis les paramètres de la requête
    const query = 'DELETE FROM dev_app_foot.users WHERE id = $1'; // Requête SQL
    const result = await db.query(query, [userId]); // Exécute la suppression

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l’utilisateur :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression.' });
  }
};