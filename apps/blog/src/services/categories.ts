'use server'

import { db } from '@workspace/db'
import { categories, posts, postCategories } from '@workspace/db/schema'
import { and, asc, desc, eq, ne, sql } from 'drizzle-orm'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

// Validation schemas
const CategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug must be lowercase, alphanumeric with hyphens'
  ),
  description: z.string().optional()
})

export type Category = typeof categories.$inferSelect
export type CreateCategoryInput = z.infer<typeof CategorySchema>
export type UpdateCategoryInput = Partial<CreateCategoryInput>

// Cache key for revalidation
const CATEGORIES_CACHE_KEY = '/api/categories'

/**
 * Get all categories with optional filtering and pagination
 */
export async function getCategories({
  query = '',
  page = 1,
  limit = 10,
  sortBy = 'name',
  sortOrder = 'asc'
}: {
  query?: string
  page?: number
  limit?: number
  sortBy?: keyof typeof categories
  sortOrder?: 'asc' | 'desc'
} = {}) {
  try {
    const offset = (page - 1) * limit
    const orderBy = sortOrder === 'asc' ? asc : desc

    // Build where conditions
    const whereConditions = []
    
    if (query) {
      whereConditions.push(
        sql`LOWER(${categories.name}) LIKE ${`%${query.toLowerCase()}%`} OR 
            LOWER(${categories.slug}) LIKE ${`%${query.toLowerCase()}%`} OR 
            LOWER(COALESCE(${categories.description}, '')) LIKE ${`%${query.toLowerCase()}%`}`
      )
    }

    // Get total count
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(categories)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

    const total = Number(totalResult?.count) || 0
    const totalPages = Math.ceil(total / limit)

    // Get paginated results
    let query = db
      .select()
      .from(categories)
      .$dynamic()
      
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions))
    }
    
    // Apply sorting
    const sortField = categories[sortBy as keyof typeof categories] || categories.name
    query = query.orderBy(orderBy(sortField))
    
    // Apply pagination
    const results = await query.limit(limit).offset(offset)

    return {
      data: results,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }
}

/**
 * Get a single category by ID
 */
export async function getCategoryById(id: string) {
  try {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, Number(id)))
      .limit(1)

    if (!category) {
      throw new Error('Category not found')
    }

    return category
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error)
    throw new Error('Failed to fetch category')
  }
}

/**
 * Get a category by slug
 */
export async function getCategoryBySlug(slug: string) {
  try {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1)

    if (!category) {
      throw new Error('Category not found')
    }

    return category
  } catch (error) {
    console.error(`Error fetching category with slug ${slug}:`, error)
    throw new Error('Failed to fetch category')
  }
}

/**
 * Create a new category
 */
export async function createCategory(input: z.infer<typeof CategorySchema>) {
  try {
    const validatedData = CategorySchema.parse(input)

    // Check if slug already exists
    const [existingCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, validatedData.slug))
      .limit(1)

    if (existingCategory) {
      throw new Error('A category with this slug already exists')
    }

    const [newCategory] = await db
      .insert(categories)
      .values(validatedData)
      .returning()

    revalidatePath(CATEGORIES_CACHE_KEY)
    return newCategory
  } catch (error) {
    console.error('Error creating category:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create category'
    )
  }
}

/**
 * Update an existing category
 */
export async function updateCategory(id: string, input: z.infer<typeof CategorySchema>) {
  try {
    const validatedData = CategorySchema.partial().parse(input)

    const [existingCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, parseInt(id)))
      .limit(1)

    if (!existingCategory) {
      throw new Error('Category not found')
    }

    // If slug is being updated, check for conflicts
    if (validatedData.slug && validatedData.slug !== existingCategory.slug) {
      const [conflict] = await db
        .select()
        .from(categories)
        .where(and(
          eq(categories.slug, validatedData.slug),
          ne(categories.id, parseInt(id))
        ))
        .limit(1)

      if (conflict) {
        throw new Error('A category with this slug already exists')
      }
    }

    const [updatedCategory] = await db
      .update(categories)
      .set({
        ...validatedData,
        updatedAt: new Date()
      })
      .where(eq(categories.id, Number(id)))
      .returning()

    revalidatePath(CATEGORIES_CACHE_KEY)
    revalidatePath(`${CATEGORIES_CACHE_KEY}/${updatedCategory.slug}`)
    return updatedCategory
  } catch (error) {
    console.error(`Error updating category with id ${id}:`, error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update category'
    )
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string) {
  try {
    // Check if category exists
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, Number(id)))
      .limit(1)

    if (!category) {
      throw new Error('Category not found')
    }

    // Check if category has associated posts
    const [postCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(postCategories)
      .where(eq(postCategories.categoryId, Number(id)))

    if (postCount && Number(postCount.count) > 0) {
      throw new Error('Cannot delete category with associated posts')
    }

    // Delete the category
    const [deletedCategory] = await db
      .delete(categories)
      .where(eq(categories.id, Number(id)))
      .returning()

    revalidatePath(CATEGORIES_CACHE_KEY)
    revalidatePath(`${CATEGORIES_CACHE_KEY}/${deletedCategory.slug}`)
    return deletedCategory
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to delete category'
    )
  }
}

/**
 * Toggle category active status
 */
// This function is no longer needed as we don't have an isActive field
// Keeping it for backward compatibility
export async function toggleCategoryStatus(id: string) {
  throw new Error('This function is no longer supported')
}

/**
 * Get categories with post counts
 */
export async function getCategoriesWithPostCount() {
  try {
    const results = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        postCount: sql<number>`COUNT(DISTINCT ${postCategories.postId})`
      })
      .from(categories)
      .leftJoin(postCategories, eq(categories.id, postCategories.categoryId))
      .groupBy(categories.id, categories.name, categories.slug)
      .orderBy(desc(sql<number>`COUNT(DISTINCT ${postCategories.postId})`))

    return results.map(item => ({
      ...item,
      postCount: Number(item.postCount)
    }))
  } catch (error) {
    console.error('Error fetching categories with post count:', error)
    throw new Error('Failed to fetch categories with post count')
  }
}
