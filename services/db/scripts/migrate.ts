import { db } from '../src/client';
import fs from 'fs';
import path from 'path';
import { sql } from 'drizzle-orm';

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...');
    
    // Ensure migrations table exists
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS __migrations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Get all migration files
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`📦 Found ${migrationFiles.length} migration files`);

    // Get already executed migrations
    const executedMigrations = await db.execute<{ name: string }>(sql`
      SELECT name FROM __migrations ORDER BY name
    `);
    
    const executedMigrationNames = new Set(executedMigations.rows.map(m => m.name));

    // Execute new migrations
    for (const file of migrationFiles) {
      if (!executedMigrationNames.has(file)) {
        console.log(`🚀 Executing migration: ${file}`);
        
        // Read and execute the migration file
        const migrationSql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
        await db.execute(sql.raw(migrationSql));
        
        // Record the migration
        await db.execute(sql`
          INSERT INTO __migrations (name) VALUES (${file})
        `);
        
        console.log(`✅ Successfully applied migration: ${file}`);
      }
    }
    
    console.log('🎉 All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
