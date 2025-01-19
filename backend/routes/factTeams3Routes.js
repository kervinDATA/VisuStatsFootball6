const express = require('express');
const { getStatTypes, getStats, getGoalsPer15Min } = require('../controllers/factTeams3Controller');
const router = express.Router();

// Route pour obtenir tous les types de statistiques
router.get('/stat-types', getStatTypes);

// Route pour obtenir les statistiques pour un type spécifique
router.get('/stats', getStats);

// Route pour obtenir le nombre de buts par tranche de 15 minutes
router.get('/goals-per-15min', getGoalsPer15Min);

module.exports = router;
