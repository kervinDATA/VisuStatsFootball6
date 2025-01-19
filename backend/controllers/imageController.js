const supabase = require('../config/supabaseClient');

// Contrôleur pour obtenir l'URL publique d'une image
exports.getImageUrl = async (req, res) => {
  const imageName = req.params.imageName.trim(); // Supprimer les espaces et retours à la ligne
  
  try {
    const { data, error } = await supabase.storage.from('images').getPublicUrl(imageName);

    if (error) {
      console.error("Erreur Supabase :", error);
      return res.status(400).json({ error: 'Erreur de récupération de l\'URL de l\'image' });
    }

    res.json({ url: data.publicUrl });
  } catch (error) {
    console.error('Erreur interne lors de la récupération de l\'URL de l\'image :', error.stack);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
