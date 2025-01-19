const express = require('express');
const {
  getSeasons,
  getBallPossessionStats,
  getDangerousAttacksStats,
  getGoalsIntervalDistribution,
} = require('../controllers/analysisController');
const router = express.Router();

// Route pour récupérer les saisons
router.get('/seasons', getSeasons);

// Route pour récupérer les statistiques de possession et classement
router.get('/stats', getBallPossessionStats);

// Route pour récupérer les statistiques d'attaques dangereuses et de buts
router.get('/dangerous-attacks-stats', getDangerousAttacksStats);

// Route pour récupérer la répartition des buts par intervalle
router.get('/goals-interval-distribution', getGoalsIntervalDistribution);

module.exports = router;
