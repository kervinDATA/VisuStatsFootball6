const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // Importer le pool depuis db.js
const playerRoutes = require('./routes/playerRoutes'); // Importer le routeur des joueurs
const teamRoutes = require('./routes/teamRoutes'); // Importer le routeur des équipes
const fixtureRoutes = require('./routes/fixtureRoutes');
const seasonRoutes = require('./routes/seasonRoutes');
const teamStatsRoutes = require('./routes/teamStatsRoutes'); // Routes pour les statistiques d'équipes
const factTeams1Routes = require('./routes/factTeams1Routes');
const factTeams2Routes = require('./routes/factTeams2Routes');
const factTeams3Routes = require('./routes/factTeams3Routes');
const factTeams4Routes = require('./routes/factTeams4Routes');
const factTeams5Routes = require('./routes/factTeams5Routes');
const factTeams6Routes = require('./routes/factTeams6Routes');


const authRoutes = require('./routes/authRoutes'); // Importer les routes d'authentification

const app = express();

app.use(cors());
app.use(express.json());

// Routes principales
app.use('/players', playerRoutes);
app.use('/teams', teamRoutes); // Route pour les équipes
app.use('/fixtures', fixtureRoutes);
app.use('/seasons', seasonRoutes);

// Route pour les statistiques d'équipe, sans paramètre dynamique dans app.use
app.use('/teams', teamStatsRoutes);

app.use('/fact-teams1', factTeams1Routes);
app.use('/fact-teams2', factTeams2Routes);
app.use('/fact-teams3', factTeams3Routes);
app.use('/fact-teams4', factTeams4Routes);
app.use('/fact-teams5', factTeams5Routes);
app.use('/fact-teams6', factTeams6Routes);


app.use('/auth', authRoutes); // Route pour l'authentification

console.log("Database URL:", process.env.DATABASE_URL);

// Middleware de gestion d'erreur global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Une erreur serveur est survenue.' });
});


// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
