import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { hash } from 'bcryptjs';
import * as schema from './schema';
import path from 'path';
import { sql } from 'drizzle-orm';
import type { NewUser, NewCategory, NewPost, NewTag, NewPostTag } from './schema';

// Create a single connection to the database
const sqlite = new Database(path.resolve(process.cwd(), '../../data/blog.db'));

// Enable foreign key constraints and WAL mode for better performance
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

// Create the drizzle instance with the schema
export const db = drizzle(sqlite, { 
  schema,
  logger: process.env.NODE_ENV === 'development',
});

export async function initializeDatabase() {
  try {
    // Check if we already have an admin user
    const users = await db.select().from(schema.users).limit(1);
    
    if (users.length === 0) {
      console.log('Initializing database with sample data...');
      
      // Create admin user
      const hashedPassword = await hash('admin123', 12);
      const now = new Date();
      const adminUser: NewUser = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: now,
        updatedAt: now,
      };
      
      const [createdUser] = await db
        .insert(schema.users)
        .values(adminUser)
        .returning();
        
      const adminUserWithId = createdUser;
      
      // Insert default categories
      const defaultCategories: NewCategory[] = [
        {
          name: 'Uncategorized',
          slug: 'uncategorized',
          description: 'Default category for posts',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Technology',
          slug: 'technology',
          description: 'Posts about technology and gadgets',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Programming',
          slug: 'programming',
          description: 'Posts about programming and software development',
          createdAt: now,
          updatedAt: now,
        },
      ];
      
      const [uncategorized, technology, programming] = await db
        .insert(schema.categories)
        .values(defaultCategories)
        .returning();
      
      // Insert some sample tags
      const sampleTags: NewTag[] = [
        { 
          name: 'Next.js', 
          slug: 'nextjs', 
          description: 'The React Framework for Production',
          createdAt: now,
        },
        { 
          name: 'React', 
          slug: 'react', 
          description: 'A JavaScript library for building user interfaces',
          createdAt: now,
        },
        { 
          name: 'TypeScript', 
          slug: 'typescript', 
          description: 'TypeScript is a typed superset of JavaScript',
          createdAt: now,
        },
      ];
      
      const [nextjs, react, typescript] = await db
        .insert(schema.tags)
        .values(sampleTags)
        .returning();
      
      // Insert a welcome post
      const welcomePostData: NewPost = {
        title: 'Welcome to the Blog',
        slug: 'welcome-to-the-blog',
        content: `# Welcome to Our Blog

This is a sample blog post to get you started. You can edit or delete it from the dashboard.

## Features

- Markdown support
- Categories and tags
- Comments system
- User authentication
- And much more!

Happy blogging!`,
        excerpt: 'A warm welcome to our new blog platform',
        categoryId: uncategorized.id,
        authorId: createdUser.id,
        published: true,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      };

      const [welcomePost] = await db
        .insert(schema.posts)
        .values(welcomePostData)
        .returning();
      
      // Associate tags with the welcome post
      const postTags: NewPostTag[] = [
        { postId: welcomePost.id, tagId: nextjs.id },
        { postId: welcomePost.id, tagId: react.id },
        { postId: welcomePost.id, tagId: typescript.id },
      ];
      
      await db.insert(schema.postTags).values(postTags);
      
      console.log('Database initialized successfully!');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize the database when this module is imported
initializeDatabase().catch(console.error);

export type Database = typeof db;
