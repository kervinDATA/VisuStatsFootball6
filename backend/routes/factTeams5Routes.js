const express = require('express');
const { getStatTypes, getStats, getPenaltyStats } = require('../controllers/factTeams5Controller');
const router = express.Router();

// Route pour obtenir tous les types de statistiques
router.get('/stat-types', getStatTypes);

// Route pour obtenir les statistiques des pénalités
router.get('/stats', getStats);

// Route pour obtenir le total des pénalités et des buts marqués sur pénalités
router.get('/penalty-stats', getPenaltyStats);

module.exports = router;
