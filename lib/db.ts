// lib/db.ts
import { neon } from '@vercel/postgres';

// Use @vercel/postgres for serverless compatibility
const sql = neon(process.env.POSTGRES_URL!);

export { sql };