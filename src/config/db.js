const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// PostgreSQL Database Connection
const pool = new Pool({
  connectionString: process.env.DB_URL
});

pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch(err => console.error('❌ PostgreSQL Connection Error:', err));

module.exports = {pool};
