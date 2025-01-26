const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      console.log('Authorization Header:', authHeader);
  
      if (!authHeader) {
        return res.status(403).json({ message: 'Aucun en-tête d\'autorisation fourni' });
      }
  
      const token = authHeader.split(' ')[1];
      console.log('Token reçu :', token);
  
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.error('Erreur de vérification du token :', err.message);
          return res.status(401).json({ message: 'Token invalide ou expiré' });
        }
  
        console.log('Token décodé :', decoded);
        req.userId = decoded.id; // Stocker l'ID utilisateur
        next();
      });
    } catch (error) {
      console.error('Erreur dans le middleware de vérification du token :', error.message);
      return res.status(500).json({ message: 'Erreur serveur lors de la vérification du token' });
    }
  };

module.exports = verifyToken;