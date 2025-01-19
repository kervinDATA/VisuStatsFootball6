const express = require('express');
const { getFixtures } = require('../controllers/fixtureController');
const router = express.Router();

// Route pour récupérer les fixtures
router.get('/', getFixtures);

module.exports = router;
