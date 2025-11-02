import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testConnection() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  
  if (!connectionString) {
    console.error('No database connection string found in environment variables');
    process.exit(1);
  }

  console.log('Testing database connection...');
  const sql = neon(connectionString);

  try {
    // Test connection
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful!', result);

    // Check if posts table exists
    try {
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'posts';
      `;
      
      if (tables.length > 0) {
        console.log('✅ Posts table exists!');
        
        // Check if there are any posts
        const posts = await sql`SELECT * FROM posts LIMIT 5;`;
        console.log(`📝 Found ${posts.length} posts in the database:`);
        console.table(posts);
      } else {
        console.log('ℹ️ Posts table does not exist. Creating it now...');
        
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
        
        console.log('✅ Posts table created successfully!');
        
        // Add a sample post
        await sql`
          INSERT INTO posts (title, slug, excerpt, content, published, author)
          VALUES (
            'Welcome to BlogSpace',
            'welcome-to-blogspace',
            'Get started with your new blog',
            'This is your first blog post. Welcome to BlogSpace!',
            true,
            'Admin'
          );
        `;
        
        console.log('✅ Added a sample post!');
      }
    } catch (error) {
      console.error('❌ Error checking/creating posts table:', error);
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check if your database is running and accessible');
    console.log('2. Verify the connection string in .env.local');
    console.log('3. Make sure your IP is whitelisted in the database settings');
    console.log('4. Check if the database credentials are correct');
  }
}

testConnection();
