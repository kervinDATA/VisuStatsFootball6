const express = require('express');
const { getAllPlayers, getPlayerById } = require('../controllers/playerController');
const router = express.Router();

// Route pour récupérer tous les joueurs
router.get('/', getAllPlayers);

// Route pour récupérer un joueur spécifique
router.get('/:id', getPlayerById);

module.exports = router;
