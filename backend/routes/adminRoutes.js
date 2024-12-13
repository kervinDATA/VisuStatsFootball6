const express = require('express');
const router = express.Router();
const { getGlobalStatistics } = require('../controllers/adminController');

// Route pour récupérer les statistiques globales
router.get('/statistics', getGlobalStatistics);

module.exports = router;
