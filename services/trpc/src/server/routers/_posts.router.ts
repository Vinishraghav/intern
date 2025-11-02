import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db, posts, categories, type Post, type NewPost, type Category } from '@workspace/db';
import { eq, desc, and, sql, isNull } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';

// Helper function to generate a slug from a string
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-'); // Replace multiple hyphens with a single one
}

// Define input schemas
const createPostInput = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  categoryId: z.number(),
  published: z.boolean().optional().default(false),
  slug: z.string().optional(),
});

const updatePostInput = createPostInput.extend({
  id: z.number(),
});

const postsQueryInput = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  category: z.string().optional(),
  search: z.string().optional(),
  includeDrafts: z.boolean().default(false),
});

// Define the posts router
export const postsRouter = router({
  // Get all posts with pagination and filtering
  getPosts: publicProcedure
    .input(postsQueryInput)
    .query(async ({ input }) => {
      const { page = 1, limit = 10, category, search, includeDrafts = false } = input;
      const offset = (page - 1) * limit;

      // Base query with joins
      const query = db
        .select()
        .from(posts)
        .leftJoin(categories, eq(posts.categoryId, categories.id))
        .$dynamic();

      // Apply filters
      const conditions: SQL[] = [];
      
      if (!includeDrafts) {
        conditions.push(eq(posts.published, true));
      }

      if (category) {
        conditions.push(eq(categories.slug, category));
      }

      if (search) {
        conditions.push(
          sql`(${posts.title} LIKE ${'%' + search + '%'} OR ${posts.content} LIKE ${'%' + search + '%'})`
        );
      }

      // Apply all conditions
      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      // Get total count for pagination
      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(posts)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
        
      const total = totalResult[0]?.count ?? 0;

      // Get paginated results
      const results = await query
        .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
        .limit(limit)
        .offset(offset);

      // Transform the results to match the expected format
      const formattedResults = results.map(({ posts, categories }) => ({
        ...posts,
        category: categories ? {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
        } : null,
      }));

      return {
        posts: formattedResults,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }),

  // Get a single post by ID or slug
  getPost: publicProcedure
    .input(z.object({
      id: z.number().optional(),
      slug: z.string().optional(),
    }))
    .query(async ({ input }) => {
      if (!input.id && !input.slug) {
        throw new Error('Either id or slug must be provided');
      }

      const result = await db
        .select()
        .from(posts)
        .leftJoin(categories, eq(posts.categoryId, categories.id))
        .where(
          input.id 
            ? eq(posts.id, input.id)
            : eq(posts.slug, input.slug as string)
        )
        .limit(1);

      if (result.length === 0) {
        return null;
      }

      const { posts: post, categories: category } = result[0];
      
      return {
        ...post,
        category: category ? {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
        } : null,
      };
    }),

  // Create a new post
  createPost: publicProcedure
    .input(createPostInput)
    .mutation(async ({ input }) => {
      const slug = input.slug || generateSlug(input.title);
      const now = new Date();
      
      const [newPost] = await db
        .insert(posts)
        .values({
          ...input,
          slug,
          publishedAt: input.published ? now : null,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return newPost;
    }),

  // Update an existing post
  updatePost: publicProcedure
    .input(updatePostInput)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const now = new Date();
      
      const [updatedPost] = await db
        .update(posts)
        .set({
          ...data,
          updatedAt: now,
          publishedAt: data.published ? new Date() : undefined,
        })
        .where(eq(posts.id, id))
        .returning();

      return updatedPost;
    }),

  // Delete a post
  deletePost: publicProcedure
    .input(z.number())
    .mutation(async ({ input: id }) => {
      const [deletedPost] = await db
        .delete(posts)
        .where(eq(posts.id, id))
        .returning();

      return deletedPost;
    })
});

// Export the router type
export type PostsRouter = typeof postsRouter;
