const express = require('express');
const { getAllVenues } = require('../controllers/venuesController');
const router = express.Router();

// Route pour obtenir toutes les informations des lieux
router.get('/', getAllVenues);

module.exports = router;
