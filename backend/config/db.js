const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err.stack);
  } else {
    console.log('Connecté à la base de données PostgreSQL');
  }
});


pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection test error:', err.stack);
  } else {
    console.log('Connection test success:', res.rows);
  }
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});


module.exports = pool;
