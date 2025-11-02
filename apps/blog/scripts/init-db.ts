import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('Database connection string not found in environment variables');
}

const sql = neon(connectionString);

async function initializeDatabase() {
  try {
    // Create posts table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT,
        excerpt TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        published BOOLEAN DEFAULT false,
        cover_image TEXT,
        author TEXT
      );
    `;

    // Insert a sample post if the table is empty
    const { rowCount } = await sql`SELECT 1 FROM posts LIMIT 1`;
    
    if (!rowCount) {
      await sql`
        INSERT INTO posts (title, slug, excerpt, content, published, author)
        VALUES (
          'Welcome to BlogSpace',
          'welcome-to-blogspace',
          'Get started with your new blog',
          'This is your first blog post. You can edit or delete it from the admin panel.',
          true,
          'Admin'
        );
      `;
      console.log('Sample post created successfully!');
    }

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
