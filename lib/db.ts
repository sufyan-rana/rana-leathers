// lib/db.ts
import { sql } from '@vercel/postgres';

// Export sql directly
export { sql };

// For backward compatibility
export const query = sql;

// For getClient compatibility
export async function getClient() {
  return {
    query: async (text: string, params?: any[]) => {
      const result = await sql`${text}`;
      return { rows: result };
    },
    release: () => {}
  };
}