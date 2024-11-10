const express = require('express');
const supabase = require('../config/supabaseClient'); // Assurez-vous que le chemin est correct
const router = express.Router();

// Route pour obtenir l'URL publique d'une image dans Supabase
router.get('/image-url/:imageName', async (req, res) => {
  const imageName = req.params.imageName.trim(); // Supprimer les espaces et retours à la ligne
  const { data, error } = await supabase.storage.from('images').getPublicUrl(imageName);

  if (error) {
    return res.status(400).json({ error: 'Erreur de récupération de l\'URL de l\'image' });
  }

  res.json({ url: data.publicUrl });
});

module.exports = router;
