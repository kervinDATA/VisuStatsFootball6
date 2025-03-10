const express = require('express');
const cors = require('cors');
const app = express();

// Import des routes
const playerRoutes = require('./routes/playerRoutes');
const teamRoutes = require('./routes/teamRoutes');
const fixtureRoutes = require('./routes/fixtureRoutes');
const seasonRoutes = require('./routes/seasonRoutes');
const teamStatsRoutes = require('./routes/teamStatsRoutes');
const factTeams1Routes = require('./routes/factTeams1Routes');
const factTeams2Routes = require('./routes/factTeams2Routes');
const factTeams3Routes = require('./routes/factTeams3Routes');
const factTeams4Routes = require('./routes/factTeams4Routes');
const factTeams5Routes = require('./routes/factTeams5Routes');
const factTeams6Routes = require('./routes/factTeams6Routes');
const venuesRoutes = require('./routes/venuesRoutes');
const scoresRoutes = require('./routes/scoresRoutes');
const imageRoutes = require('./routes/imageRoutes');
const standingRoutes = require('./routes/standingRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const userAnalysisRoutes = require('./routes/userAnalysisRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const { setupSwagger } = require('./swagger/swagger.js');

// Configuration de CORS
app.use(cors({ origin: '*' }));

// Middleware pour parser les JSON
app.use(express.json());

// Logger pour chaque requête (pour diagnostiquer)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes principales
app.use('/players', playerRoutes);
app.use('/teams', teamRoutes);
app.use('/fixtures', fixtureRoutes);
app.use('/seasons', seasonRoutes);
app.use('/venues', venuesRoutes);
app.use('/scores', scoresRoutes);
app.use('/teams/stats', teamStatsRoutes);
app.use('/fact-teams1', factTeams1Routes);
app.use('/fact-teams2', factTeams2Routes);
app.use('/fact-teams3', factTeams3Routes);
app.use('/fact-teams4', factTeams4Routes);
app.use('/fact-teams5', factTeams5Routes);
app.use('/fact-teams6', factTeams6Routes);
app.use('/api/analysis', analysisRoutes);
app.use('/user-analysis', userAnalysisRoutes);
app.use('/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/standings', standingRoutes);
app.use('/admin', adminRoutes);

console.log('=== AVANT setupSwagger ===');
setupSwagger(app);
console.log('=== APRES setupSwagger ===');

// Middleware de gestion d'erreurs global
app.use((err, req, res, next) => {
  console.error('Erreur capturée dans le middleware global :', err.stack);
  res.status(500).json({ error: 'Une erreur serveur est survenue.' });
});

// Vérification du bon démarrage de l'application
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});