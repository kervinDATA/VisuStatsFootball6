const express = require('express');
const { getStatTypes, getStats } = require('../controllers/factTeams2Controller');
const router = express.Router();

// Route pour obtenir tous les types de statistiques
router.get('/stat-types', getStatTypes);

// Route pour obtenir les statistiques pour un type spécifique
router.get('/stats', getStats);

module.exports = router;
