const express = require('express');
const { getStatTypes, getStats, getBallPossession } = require('../controllers/factTeams1Controller');
const router = express.Router();

router.get('/stat-types', getStatTypes);
router.get('/stats', getStats);
router.get('/ball-possession', getBallPossession);

module.exports = router;
