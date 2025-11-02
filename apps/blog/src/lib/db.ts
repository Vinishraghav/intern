import { neon, NeonQueryFunction } from '@neondatabase/serverless';

// Use the working connection string directly for now
const connectionString = 'postgresql://neondb_owner:npg_QU8iwfVl4Nxc@ep-round-sun-aevt1w4e-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

console.log('Using Neon database connection...');

// Create a typed SQL client with SSL configuration
const sql: NeonQueryFunction<false, false> = neon(connectionString, {
  fetchOptions: {
    // Required for Neon's serverless driver
    // @ts-ignore
    credentials: 'omit',
    mode: 'cors'
  }
});

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
