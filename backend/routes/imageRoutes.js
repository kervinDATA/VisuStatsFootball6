const express = require('express');
const { getImageUrl } = require('../controllers/imageController');
const router = express.Router();

// Route pour obtenir l'URL publique d'une image
router.get('/image-url/:imageName', getImageUrl);

module.exports = router;
