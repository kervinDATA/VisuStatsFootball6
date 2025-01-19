const express = require('express');
const { getStatTypes, getStats } = require('../controllers/factTeams6Controller');
const router = express.Router();

// Route pour obtenir tous les types de statistiques
router.get('/stat-types', getStatTypes);

// Route pour obtenir les statistiques des tirs
router.get('/stats', getStats);

module.exports = router;
