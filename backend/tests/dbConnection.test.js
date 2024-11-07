const { Pool } = require('pg');
require('dotenv').config(); // Charge les variables d'environnement

// Crée une instance de Pool pour ce test uniquement
const testPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // Désactive SSL si nécessaire
});

describe('Test de connexion à la base de données', () => {
  it('devrait établir une connexion réussie avec la base de données', async () => {
    const client = await testPool.connect();
    const result = await client.query('SELECT NOW()');
    expect(result).toBeDefined();
    expect(result.rows.length).toBeGreaterThan(0);
    client.release(); // Libère la connexion après utilisation
  });

  afterAll(async () => {
    await testPool.end(); // Ferme le pool de connexions du test
  });
});


