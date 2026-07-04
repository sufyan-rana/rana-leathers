// lib/db.ts
import { neon } from '@vercel/postgres';

// Create a connection function
const sql = neon(process.env.POSTGRES_URL!);

// Export the sql function directly
export { sql };

// Export a query function for compatibility
export async function query(text: string, params?: any[]) {
  // For raw SQL queries - use sql for most cases
  try {
    const result = await sql`${text}`;
    return { rows: result };
  } catch (error) {
    console.error('Query error:', error);
    return { rows: [] };
  }
}

// Export getClient (returns a connection)
export async function getClient() {
  return {
    query: async (text: string, params?: any[]) => {
      const result = await sql`${text}`;
      return { rows: result };
    },
    release: () => {}
  };
}