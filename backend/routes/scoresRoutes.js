const express = require('express');
const { getAllScores } = require('../controllers/scoresController');
const router = express.Router();

// Route pour obtenir tous les scores
router.get('/', getAllScores);

module.exports = router;
