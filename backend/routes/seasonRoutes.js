const express = require('express');
const { getAllSeasons, getSeasonById } = require('../controllers/seasonController');
const router = express.Router();

// Route pour récupérer toutes les saisons
router.get('/', getAllSeasons);

// Route pour récupérer une saison spécifique
router.get('/:id', getSeasonById);

module.exports = router;
