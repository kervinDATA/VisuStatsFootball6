const express = require('express');
const router = express.Router();
const { getGlobalStatistics, getUsers, deleteUser } = require('../controllers/adminController');

// Route pour récupérer les statistiques globales
router.get('/statistics', getGlobalStatistics);

// Route pour récupérer la liste des utilisateurs
router.get('/users', getUsers);

// Route pour supprimer un utilisateur
router.delete('/users/:id', deleteUser);

module.exports = router;