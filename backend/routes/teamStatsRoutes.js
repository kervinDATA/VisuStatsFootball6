const express = require('express');
const {
  getAttacksStats,
  getCleanSheets,
  getGoalsByPeriods,
  getGoals,
  getPenalties,
  getShots,
} = require('../controllers/teamStatsController');
const router = express.Router();

// Route pour obtenir les statistiques d'attaques
router.get('/:id/attacks', getAttacksStats);

// Route pour les cleansheets
router.get('/:id/cleansheets', getCleanSheets);

// Route pour les buts par périodes
router.get('/:id/goals_periods', getGoalsByPeriods);

// Route pour les buts globaux
router.get('/:id/goals', getGoals);

// Route pour les pénalités
router.get('/:id/penalties', getPenalties);

// Route pour les tirs
router.get('/:id/shots', getShots);

module.exports = router;
