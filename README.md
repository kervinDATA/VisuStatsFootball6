VisuStatsFootball

VisuStatsFootball est une application web spécialisée dans l'analyse et la visualisation des statistiques de la Scottish Professional Football League (SPFL). Cette application a pour objectif de démocratiser l'analyse des performances des équipes et des joueurs grâce à des graphiques interactifs et des tableaux de données accessibles aux fans de football.

🚀 Fonctionnalités principales

Exploration des statistiques des équipes et joueurs : Analyse des performances des équipes, joueurs, et saisons.

Visualisation de données : Graphiques interactifs basés sur les données de la SPFL.

Espace utilisateur personnalisé : Créez et sauvegardez vos propres analyses.

Dashboard Administrateur : Gestion des utilisateurs et visualisation des statistiques globales de l'application.

📦 Structure du projet

APP_FOOT/
├── backend/           # API REST (Node.js, Express, PostgreSQL, Supabase)
├── frontend/          # Application Frontend (Angular 18)
└── docker-compose.yml # Orchestration des conteneurs Docker

⚙️ Technologies utilisées

Frontend : Angular 18, ApexCharts, TailwindCSS, Flowbite

Backend : Node.js, Express, PostgreSQL, Supabase

Authentification : JWT (JSON Web Tokens)

Conteneurisation : Docker, Docker Compose

🐳 Lancement de l'application (via Docker)

Cloner le dépôt :

git clone https://github.com/votre-repo/VisuStatsFootball.git
cd VisuStatsFootball

Construire et lancer les conteneurs :

docker-compose up --build

Accéder à l'application :

Frontend : http://localhost:4200

Backend API : http://localhost:5002

🔐 Configuration des variables d'environnement

Créez un fichier .env dans le dossier backend/ :

PORT=5000
SUPABASE_URL=Votre_URL_Supabase
SUPABASE_KEY=Votre_Clé_API_Supabase
DATABASE_URL=Votre_URL_Base_de_Données_PostgreSQL
JWT_SECRET=Votre_Clé_Secrète

📊 Endpoints API principaux

Authentification : /auth/register, /auth/login

Statistiques : /players, /teams, /fixtures, /analysis, /user-analysis

Administration : /admin/statistics, /admin/users

✅ Tests

Les tests unitaires sont implémentés avec Jest.

cd backend
npm run test
