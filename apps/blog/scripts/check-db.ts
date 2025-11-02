import { neon } from '@neondatabase/serverless';

async function checkDatabase() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  
  if (!connectionString) {
    console.error('No database connection string found in environment variables');
    process.exit(1);
  }

  const sql = neon(connectionString);

  try {
    // Check if posts table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    
    console.log('Available tables:');
    console.table(tables);

    // Check posts table structure
    try {
      const posts = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'posts';
      `;
      console.log('\nPosts table columns:');
      console.table(posts);
    } catch (e) {
      console.error('\nError checking posts table:', e.message);
      console.log('\nCreating posts table...');
      
      await sql`
        CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          excerpt TEXT,
          content TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          published BOOLEAN DEFAULT false,
          cover_image TEXT,
          author TEXT
        );
      `;
      
      console.log('Posts table created successfully!');
    }

  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
}

checkDatabase();
