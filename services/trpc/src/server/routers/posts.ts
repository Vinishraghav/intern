import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { posts, postCategories } from '../../../../db/src/schema'
import { eq, desc, and } from 'drizzle-orm'

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  published: z.boolean().default(false),
  categoryIds: z.array(z.number()).optional(),
})

export const postsRouter = router({
  create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const slug = input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      const [post] = await ctx.db.insert(posts).values({
        title: input.title,
        content: input.content,
        excerpt: input.excerpt,
        slug,
        published: input.published,
      }).returning()
      
      if (input.categoryIds?.length) {
        await ctx.db.insert(postCategories).values(
          input.categoryIds.map(catId => ({
            postId: post.id,
            categoryId: catId,
          }))
        )
      }
      
      return post
    }),

  list: publicProcedure
    .input(z.object({
      published: z.boolean().optional(),
      categoryId: z.number().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      let conditions = []
      
      if (input?.published !== undefined) {
        conditions.push(eq(posts.published, input.published))
      }
      
      const allPosts = conditions.length > 0
        ? await ctx.db.select().from(posts).where(and(...conditions)).orderBy(desc(posts.createdAt))
        : await ctx.db.select().from(posts).orderBy(desc(posts.createdAt))
      
      return allPosts
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const [post] = await ctx.db.select().from(posts).where(eq(posts.slug, input.slug))
      if (!post) throw new Error('Post not found')
      return post
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
      excerpt: z.string().optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      const [updated] = await ctx.db.update(posts).set({
        ...data,
        updatedAt: new Date(),
      }).where(eq(posts.id, id)).returning()
      return updated
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(postCategories).where(eq(postCategories.postId, input.id))
      await ctx.db.delete(posts).where(eq(posts.id, input.id))
      return { success: true }
    }),
})
