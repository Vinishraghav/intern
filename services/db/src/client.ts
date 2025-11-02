import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || '';

if (!connectionString) {
  console.warn('DATABASE_URL not set');
}

const sql = neon(connectionString);

// Create the database connection with proper type safety
export const db = drizzle(sql, {
  schema,
  logger: process.env.NODE_ENV !== 'production',
});
