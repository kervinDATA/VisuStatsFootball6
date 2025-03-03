# 📖 Documentation de l'API VisuStatsFootball

## 🏆 Introduction
L'API **VisuStatsFootball** permet d'accéder à diverses données analytiques et statistiques sur les équipes de football.

Elle fournit des endpoints pour :
- Gérer les utilisateurs (Admin)
- Récupérer des statistiques détaillées sur les équipes
- Sauvegarder et gérer des analyses utilisateur

---

## 🚀 Installation et Lancement

### 1️⃣ **Prérequis**
- Node.js et npm installés
- PostgreSQL configuré
- **Swagger UI disponible** : [Documentation en ligne](https://visu-stats-football6.vercel.app/)

### 2️⃣ **Cloner le projet**
```sh
git clone https://github.com/ton-utilisateur/VisuStatsFootball6.git
cd VisuStatsFootball6
```

### 3️⃣ **Installer les dépendances**
```sh
npm install
```

### 4️⃣ **Configurer la base de données** (PostgreSQL)
```sh
cp .env.example .env
# Modifier le fichier .env avec vos paramètres PostgreSQL
```

### 5️⃣ **Lancer le serveur**
```sh
node server.js
```
👉 L'API tourne maintenant sur `http://localhost:5002`

---

## 📡 Endpoints de l'API

### 🛠️ **1. ADMIN**

#### 🔹 **Récupérer les statistiques globales**
`GET /admin/statistics`

📌 **Réponse attendue** :
```json
{
  "totalUsers": 100,
  "totalAnalyses": 350
}
```
---

#### 🔹 **Lister tous les utilisateurs**
`GET /admin/users`

📌 **Réponse attendue** :
```json
[
  {
    "id": "123",
    "email": "user@example.com",
    "role": "admin"
  }
]
```

#### 🔹 **Supprimer un utilisateur**
`DELETE /admin/users/{id}`

📌 **Paramètre** : `id` (ID utilisateur)
📌 **Réponse attendue** :
- `200 OK` : `{ "message": "Utilisateur supprimé." }`
- `404 Not Found` : `{ "message": "Utilisateur non trouvé." }`

---

### 📊 **2. ANALYSE DU SITE**

#### 🔹 **Lister les saisons disponibles**
`GET /api/analysis/seasons`

📌 **Réponse attendue** :
```json
[
  { "season_id": 1, "season_name": "2023/2024" }
]
```

#### 🔹 **Récupérer la possession de balle et classement par saison**
`GET /api/analysis/stats?season_name=2023/2024`

📌 **Réponse attendue** :
```json
[
  { "team_id": 1, "team_name": "FC Example", "ball_possession": "60%", "team_position": 3 }
]
```

---

### ⚽ **3. ÉQUIPES**

#### 🔹 **Lister toutes les équipes**
`GET /teams`

📌 **Réponse attendue** :
```json
[
  { "team_id": 1, "name": "FC Example" }
]
```

#### 🔹 **Obtenir les détails d'une équipe**
`GET /teams/{id}/details`

📌 **Réponse attendue** :
```json
{
  "team_id": 1,
  "name": "FC Example",
  "image": "url_image.jpg",
  "founded": 1900,
  "stadium": "Stadium Name",
  "city": "City",
  "capacity": 50000
}
```

---

### 📊 **4. ANALYSES UTILISATEURS**

#### 🔹 **Sauvegarder une analyse utilisateur**
`POST /user-analysis/save`

📌 **Corps de la requête** :
```json
{
  "name": "Analyse 1",
  "charts": [{ "season": "2023", "statType": "Possession", "chartData": {} }],
  "user_id": "123"
}
```

📌 **Réponse attendue** :
```json
{
  "id": 10,
  "name": "Analyse 1",
  "charts": [{ "season": "2023", "statType": "Possession", "chartData": {} }],
  "user_id": "123"
}
```

#### 🔹 **Mettre à jour une analyse utilisateur**
`PUT /user-analysis/update/{id}`

📌 **Paramètre** : `id` (ID de l'analyse)
📌 **Corps de la requête** :
```json
{
  "name": "Nouvelle Analyse",
  "charts": [{ "season": "2023", "statType": "Possession", "chartData": {} }],
  "user_id": "123"
}
```

📌 **Réponse attendue** :
```json
{
  "id": 10,
  "name": "Nouvelle Analyse",
  "charts": [{ "season": "2023", "statType": "Possession", "chartData": {} }],
  "user_id": "123"
}
```

---

## 📂 **Schémas de données**

### 🧑‍💼 **Utilisateur (`User`)**
```json
{
  "id": "123",
  "email": "user@example.com",
  "role": "admin"
}
```

### ⚽ **Statistiques des buts (`IntervalGoals`)**
```json
{
  "team_name": "Celtic",
  "interval_time": "0-15",
  "goals_percentage": "12.5%"
}
```

### 📊 **Analyse utilisateur (`UserAnalysis`)**
```json
{
  "id": 10,
  "name": "Analyse 1",
  "charts": [{ "season": "2023", "statType": "Possession", "chartData": {} }],
  "user_id": "123"
}
```

---

## 🛠️ **Bonnes pratiques**
✅ Toujours tester avec **Postman** avant d'intégrer dans une application.
✅ Respecter les formats de requêtes et de réponses JSON.
✅ Gérer les erreurs (400, 404, 500) correctement.

---

## 📩 Contact & Contributeurs
👨‍💻 **Développeur** : @ton-nom-github  
📌 **Répo GitHub** : [Lien vers le repo](https://github.com/ton-utilisateur/VisuStatsFootball6)  
📩 **Email** : contact@example.com  

🚀 **Merci d'utiliser l'API VisuStatsFootball !** 🎯

