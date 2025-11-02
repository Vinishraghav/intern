'use server'

import { db } from '@workspace/db'
import { posts, postCategories, categories } from '@workspace/db/schema'
import { eq, desc, and, or, sql, like } from 'drizzle-orm'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

interface GetPostsParams {
  page?: number
  limit?: number
  published?: boolean
  categoryId?: number
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'title'
  sortOrder?: 'asc' | 'desc'
}

type Post = typeof posts.$inferSelect & {
  categories?: Array<typeof categories.$inferSelect>
}

type PostWithCategories = Post & {
  categories: Array<{
    id: number
    name: string
    slug: string
  }>
}

// Cache key for revalidation
const POSTS_CACHE_KEY = '/api/posts'

/**
 * Get all posts with optional filtering and pagination
 */
export async function getPosts(params: GetPostsParams = {}) {
  const {
    page = 1,
    limit = 10,
    published,
    categoryId,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = params
  
  const offset = (page - 1) * limit
  
  // Build where conditions
  const conditions = []
  
  if (published !== undefined) {
    conditions.push(eq(posts.published, published))
  }
  
  if (search) {
    conditions.push(
      or(
        like(posts.title, `%${search}%`),
        like(posts.content, `%${search}%`)
      )!
    )
  }
  
  // Base query
  let query = db.select({
    id: posts.id,
    title: posts.title,
    content: posts.content,
    excerpt: posts.excerpt,
    slug: posts.slug,
    published: posts.published,
    createdAt: posts.createdAt,
    updatedAt: posts.updatedAt,
  }).from(posts)
  
  // Apply category filter if provided
  if (categoryId) {
    const postIds = await db
      .selectDistinct({ postId: postCategories.postId })
      .from(postCategories)
      .where(eq(postCategories.categoryId, categoryId))
    
    if (postIds.length > 0) {
      conditions.push(inArray(posts.id, postIds.map(p => p.postId)))
    } else {
      // No posts found for this category
      return {
        posts: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      }
    }
  }
  
  // Apply conditions
  if (conditions.length > 0) {
    query = query.where(and(...conditions))
  }
  
  // Apply sorting
  const sortColumn = posts[sortBy] || posts.createdAt
  query = sortOrder === 'asc'
    ? query.orderBy(sortColumn)
    : query.orderBy(desc(sortColumn as any))
  
  // Apply pagination
  const allPosts = await query.limit(limit).offset(offset)
  
  // Get total count
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(posts)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    
  // Get categories for each post
  const postsWithCategories = await Promise.all(
    allPosts.map(async (post) => {
      const postCats = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        })
        .from(postCategories)
        .innerJoin(categories, eq(postCategories.categoryId, categories.id))
        .where(eq(postCategories.postId, post.id))
      
      return {
        ...post,
        categories: postCats,
      }
    })
  )
  
  return {
    posts: postsWithCategories,
    pagination: {
      page,
      limit,
      total: Number(count),
      totalPages: Math.ceil(Number(count) / limit),
    },
  }
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string) {
  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1)

  if (!post) {
    return null
  }
  
  // Get categories
  const postCats = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(postCategories)
    .innerJoin(categories, eq(postCategories.categoryId, categories.id))
    .where(eq(postCategories.postId, post.id))
    
  return {
    ...post,
    categories: postCats,
  }
}

/**
 * Create a new post
 */
export async function createPost(data: {
  title: string
  content: string
  excerpt?: string
  published?: boolean
  categoryIds?: number[]
}) {
  // Generate slug
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    
  // Insert post
  const [post] = await db
    .insert(posts)
    .values({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      slug,
      published: data.published ?? false,
    })
    .returning()
    
  // Add categories
  if (data.categoryIds && data.categoryIds.length > 0) {
    await db.insert(postCategories).values(
      data.categoryIds.map((categoryId) => ({
        postId: post.id,
        categoryId,
      }))
    )
  }
  
  revalidatePath(POSTS_CACHE_KEY)
  return post
}

/**
 * Update an existing post
 */
export async function updatePost(
  id: number,
  data: {
    title?: string
    content?: string
    excerpt?: string
    published?: boolean
    categoryIds?: number[]
    tags?: string[]
  }
) {
  try {
    const updateData: any = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.content !== undefined) updateData.content = data.content
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt
    if (data.published !== undefined) updateData.published = data.published
    
    // Generate new slug if title changed
    if (data.title) {
      updateData.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }
    
    updateData.updatedAt = new Date()
    
    // Start transaction
    const [updated] = await db.transaction(async (tx) => {
      // Update post
      const [post] = await tx
        .update(posts)
        .set(updateData)
        .where(eq(posts.id, id))
        .returning()
      
      // Update categories if provided
      if (data.categoryIds !== undefined) {
        await tx.delete(postCategories).where(eq(postCategories.postId, id))
        
        if (data.categoryIds.length > 0) {
          await tx.insert(postCategories).values(
            data.categoryIds.map((categoryId) => ({
              postId: id,
              categoryId,
            }))
          )
        }
      }
      
      return [post]
    })
    
    // Handle tags if provided
    if (data.tags) {
      await handlePostTags(id.toString(), data.tags)
    }
    
    // Revalidate paths
    revalidatePath(POSTS_CACHE_KEY)
    revalidatePath(`${POSTS_CACHE_KEY}/${updated.slug}`)
    
    return updated
  } catch (error) {
    console.error('Failed to update post:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update post'
    )
  }
}

/**
 * Delete a post
 */
export async function deletePost(id: string) {
  try {
    // Check if post exists
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1)

    if (!post) {
      throw new Error('Post not found')
    }

    // Delete post-category relationships first
    await db
      .delete(postCategories)
      .where(eq(postCategories.postId, id))

    // Then delete the post
    await db
      .delete(posts)
      .where(eq(posts.id, id))

    // Revalidate cache
    revalidatePath(POSTS_CACHE_KEY)

    return { success: true }
  } catch (error) {
    console.error('Failed to delete post:', error)
    throw new Error('Failed to delete post')
  }
}

/**
 * Toggle post published status
 */
export async function togglePostStatus(id: string) {
  try {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1)

    if (!post) {
      throw new Error('Post not found')
    }

    const published = !post.published
    const publishedAt = published ? new Date() : null

    const [updatedPost] = await db
      .update(posts)
      .set({ published, publishedAt })
      .where(eq(posts.id, id))
      .returning()

    revalidatePath(POSTS_CACHE_KEY)
    revalidatePath(`${POSTS_CACHE_KEY}/${post.slug}`)
    return updatedPost
  } catch (error) {
    console.error('Failed to toggle post status:', error)
    throw new Error('Failed to toggle post status')
  }
}

/**
 * Get post statistics
 */
export async function getPostStats(postId: number) {
  const [stats] = await db
    .select({
      viewCount: posts.viewCount,
      commentCount: sql<number>`(
        SELECT COUNT(*) 
        FROM comments 
        WHERE post_id = ${postId} 
        AND approved = true
      )`,
    })
    .from(posts)
    .where(eq(posts.id, postId));

  return stats || { viewCount: 0, commentCount: 0 };
}

// Get category statistics
export async function getCategoryStats() {
  const result = await db
    .select({
      categoryId: postCategories.categoryId,
      name: categories.name,
      slug: categories.slug,
      postCount: sql<number>`COUNT(DISTINCT ${postCategories.postId})`,
    })
    .from(postCategories)
    .leftJoin(categories, eq(postCategories.categoryId, categories.id))
    .leftJoin(posts, eq(postCategories.postId, posts.id))
    .where(eq(posts.published, true))
    .groupBy(postCategories.categoryId, categories.name, categories.slug);

  return result;
}

/**
 * Get recent posts
 */
export async function getRecentPosts(limit = 5) {
  try {
    const recentPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.published, true))
      .orderBy(desc(posts.publishedAt))
      .limit(limit)

    return recentPosts
  } catch (error) {
    console.error('Failed to fetch recent posts:', error)
    throw new Error('Failed to fetch recent posts')
  }
}

/**
 * Helper function to handle post tags
 */
async function handlePostTags(postId: string, tagNames: string[]) {
  // Delete existing tags for this post
  await db
    .delete(postTags)
    .where(eq(postTags.postId, postId))

  if (tagNames.length === 0) return

  // Get or create tags
  const tagRecords = await Promise.all(
    tagNames.map(async (name) => {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      
      // Check if tag exists
      const [existingTag] = await db
        .select()
        .from(tags)
        .where(eq(tags.slug, slug))
        .limit(1)

      if (existingTag) {
        return existingTag
      }

      // Create new tag
      const [newTag] = await db
        .insert(tags)
        .values({ name, slug })
        .returning()

      return newTag
    })
  )

  // Create post-tag relationships
  await db
    .insert(postTags)
    .values(
      tagRecords.map((tag: { id: string }) => ({
        postId,
        tagId: tag.id
      }))
    )
}
