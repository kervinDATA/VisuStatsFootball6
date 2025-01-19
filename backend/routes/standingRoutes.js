const express = require('express');
const {
  getSeasonStandings,
  getTeamSeasonStanding,
  getTeamStandings,
} = require('../controllers/standingController');
const router = express.Router();

// Route pour récupérer le classement d'une saison spécifique
router.get('/season/:season_id', getSeasonStandings);

// Route pour récupérer le classement d'une équipe pour une saison spécifique
router.get('/team/:teamId/season/:seasonId', getTeamSeasonStanding);

// Route pour récupérer tous les standings d'une équipe
router.get('/team/:teamId/standings', getTeamStandings);

module.exports = router;
