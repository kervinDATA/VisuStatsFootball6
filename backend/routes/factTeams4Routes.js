const express = require('express');
const { getStatTypes, getStats, getTotalGoals } = require('../controllers/factTeams4Controller');
const router = express.Router();

// Route pour obtenir tous les types de statistiques
router.get('/stat-types', getStatTypes);

// Route pour obtenir les statistiques pour un type spécifique
router.get('/stats', getStats);

// Route pour obtenir le nombre total de buts
router.get('/total-goals', getTotalGoals);

module.exports = router;
