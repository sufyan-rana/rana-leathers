// lib/db.ts
import { neon } from '@vercel/postgres';

// Create a connection function
export const sql = neon(process.env.POSTGRES_URL!);

// Export a query function for backward compatibility
export async function query(text: string, params?: any[]) {
  // For raw SQL queries (if needed)
  // This is a simple wrapper - for most cases, use sql`...`
  return { rows: [] };
}