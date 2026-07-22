// lib/db.ts
import { Pool } from 'pg';

// Get the connection string from environment variables
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ POSTGRES_URL is not defined in environment variables');
}

// Create a connection pool
const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false, // Required for Neon
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to get a client for transactions
export async function getClient() {
  return await pool.connect();
}

export { pool };