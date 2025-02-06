# Documentation : CI/CD avec GitHub Actions et Docker

1️⃣ Introduction

Ce document décrit l'utilisation de GitHub Actions et Docker pour l'intégration continue (CI) et la vérification des builds de l'application. L'objectif est d'automatiser les tests, la construction et la validation des images Docker dans un pipeline CI/CD.

2️⃣ CI/CD avec GitHub Actions

📌 Déclenchement des Workflows

Les workflows GitHub Actions sont définis dans le fichier .github/workflows/ci-tests.yml. Ils sont exécutés automatiquement :

À chaque push ou pull request sur la branche master.

Ils incluent plusieurs jobs : tests unitaires, build et vérification des images Docker.

📌 Tests Backend et Frontend

Tests Backend (Jest) :

Vérifie les fonctionnalités du serveur avec Jest.

Utilise un service PostgreSQL pour simuler la base de données.

Tests Frontend (Karma + Jasmine) :

Exécute uniquement auth.service.spec.ts et login.component.spec.ts.

Utilise Chrome Headless pour simuler un navigateur.

📌 Build Backend et Frontend

Après les tests, GitHub Actions s'assure que :

✅ Le backend peut être exécuté sans erreur (npm start).

✅ Le frontend Angular peut être compilé en production (npm run build -- --configuration=production).

📌 Vérification des Images Docker

Enfin, un job docker-build construit les images Docker :

🛠️ Backend : docker build -t backend-app .

🛠️ Frontend : docker build -t frontend-app .

💡 Assure que la containerisation est correcte avant l'exécution locale.

3️⃣ Dockerisation du Projet

📂 Fichiers Importants

backend/Dockerfile : Définit l’image Docker pour le backend.

frontend/Dockerfile : Configure l’image Docker avec Nginx pour servir Angular.

docker-compose.yml : Lance les services backend et frontend ensemble.

📌 Utilisation de docker-compose

Pour exécuter l'application en local avec Docker :

docker-compose up --build

Cette commande :

🏗️ Construit les images Docker.

🚀 Démarre les containers (backend sur 5002, frontend sur 4200).

📌 Commandes Utiles

Arrêter les containers :

docker-compose down

Lister les containers actifs :

docker ps

Supprimer les images inutilisées :

docker system prune -a

4️⃣ Bonnes Pratiques

✅ Toujours tester localement avant un push.

✅ Vérifier les logs de GitHub Actions en cas d’erreur.

✅ Ne pas stocker d’informations sensibles dans les fichiers commités.