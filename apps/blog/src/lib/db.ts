import { neon, NeonQueryFunction } from '@neondatabase/serverless';

// Debug log environment variables (don't log full connection string for security)
console.log('Database environment variables:', {
  hasDatabaseUrl: !!process.env.DATABASE_URL,
  hasPostgresUrl: !!process.env.POSTGRES_URL,
  nodeEnv: process.env.NODE_ENV
});

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  const error = new Error('No database connection string found. Please set DATABASE_URL or POSTGRES_URL environment variable.');
  console.error(error.message);
  throw error;
}

// Create a typed SQL client
const sql: NeonQueryFunction<false, false> = neon(connectionString);

// Test the connection
async function testConnection() {
  try {
    const result = await sql`SELECT 1 as test`;
    console.log('Database connection test successful:', result);
    return true;
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    return false;
  }
}

// Test the connection when the module is loaded
const isConnected = await testConnection();
if (!isConnected) {
  throw new Error('Failed to establish database connection');
}

export { sql };
