const { Pool } = require('pg');

// Use the new user credentials
const pool = new Pool({
  connectionString: 'postgresql://db_user:dbpass123@ep-shy-grass-ai47d2yg-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Failed:', err.message);
  } else {
    console.log('✅ Connected!', res.rows[0]);
  }
  pool.end();
});
