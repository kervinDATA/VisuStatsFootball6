const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extrait le token du header

    if (!token) {
        return res.status(403).json({ message: 'Aucun token fourni' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalide' });
        }
        req.userId = decoded.id; // Stocke l'ID de l'utilisateur dans la requête
        next();
    });
};

module.exports = verifyToken;