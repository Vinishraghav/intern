# Database Service

This service provides database access for the blog application using Drizzle ORM with SQLite.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Run database migrations (if needed):
   ```bash
   npm run migrate
   ```

4. Push schema to database:
   ```bash
   npm run db:push
   ```

## Development

- `npm run dev` - Start the development server with auto-reload
- `npm run build` - Build the project for production

## Schema

The database schema is defined in `src/schema.ts`. It includes:

- `categories` - Blog post categories
- `posts` - Blog posts

## Usage

Import the database client and types:

```typescript
import { db, Post, Category } from '@workspace/db';

// Example query
const posts = await db.query.posts.findMany({
  with: {
    category: true
  }
});
```
