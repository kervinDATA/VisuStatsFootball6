const express = require('express');
const {
  getAllTeams,
  getTeamBasicInfo,
  getTeamDetailedInfo,
  getTeamImage,
} = require('../controllers/teamController');
const router = express.Router();

// Route pour récupérer toutes les équipes
router.get('/', getAllTeams);

// Route pour récupérer les informations basiques d'une équipe spécifique
router.get('/:id/basic', getTeamBasicInfo);

// Route pour récupérer les informations détaillées d'une équipe spécifique
router.get('/:id/details', getTeamDetailedInfo);

// Route pour récupérer l'image d'une équipe
router.get('/:id/image', getTeamImage);

module.exports = router;
