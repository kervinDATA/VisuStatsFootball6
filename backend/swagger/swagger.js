// backend/swagger.js
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

function setupSwagger(app) {
  console.log('=== setupSwagger initialisation ==='); // Log de test

  const swaggerPath = path.join(__dirname, 'swagger.yaml');
  console.log('=== swagger.yaml path:', swaggerPath); // Pour vérifier le chemin

  const fileContents = fs.readFileSync(swaggerPath, 'utf8');
  const swaggerDocument = yaml.load(fileContents);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('=== swagger.yaml chargé avec succès, route /api-docs créée ==='); // Confirmation
}

module.exports = { setupSwagger };

