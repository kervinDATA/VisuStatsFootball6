const express = require('express');
const {
  getCornersStats,
  getAttacksStats,
  getDangerousAttacksStats,
  getPossessionStats,
  getWinsStats,
  getLostStats,
  getDrawStats,
  getScoringIntervalsStats,
  saveUserAnalysis,
  getSavedAnalyses,
  updateAnalysis,
  deleteAnalysis,
} = require('../controllers/userAnalysisController');

const router = express.Router();

// Route pour récupérer les statistiques des corners
router.get('/stats/corners', getCornersStats);

// Route pour récupérer les statistiques des attaques
router.get('/stats/attacks', getAttacksStats);

// Route pour récupérer les statistiques des attaques dangereuses
router.get('/stats/dangerous-attacks', getDangerousAttacksStats);

// Route pour récupérer les statistiques de possession
router.get('/stats/possession', getPossessionStats);

// Route pour récupérer les statistiques des victoires
router.get('/stats/wins', getWinsStats);

// Route pour récupérer les statistiques des défaites
router.get('/stats/lost', getLostStats);

// Route pour récupérer les statistiques des matchs
router.get('/stats/draw', getDrawStats);

// Route pour récupérer les statistiques scoring minutes
router.get('/scoring-intervals', getScoringIntervalsStats);

// Route pour sauvegarder une analyse utilisateur
router.post('/save', saveUserAnalysis);

// Route pour récupérer les analyses sauvegardées d'un utilisateur
router.get('/saved-analyses', getSavedAnalyses);

// Route pour mettre à jour une analyse existante
router.put('/update/:id', updateAnalysis);

// Route pour supprimer une analyse existante
router.delete('/delete/:id', deleteAnalysis);

module.exports = router;
