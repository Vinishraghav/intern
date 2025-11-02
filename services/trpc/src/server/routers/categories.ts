import { publicProcedure, router } from '../trpc';
import { createCategorySchema, updateCategorySchema, categoriesQuerySchema, generateSlug } from '../../schemas';
import { db, categories } from '@workspace/db';
import { eq, desc, asc, sql, and } from 'drizzle-orm';
import { z } from 'zod';
import type { SQLiteSelect } from 'drizzle-orm/sqlite-core';

export const categoriesRouter = router({
  // Get all categories with pagination
  getCategories: publicProcedure
    .input(categoriesQuerySchema)
    .query(async ({ input }) => {
      const { page, limit } = input
      const offset = (page - 1) * limit

      const categoriesList = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          createdAt: categories.createdAt,
        })
        .from(categories)
        .orderBy(asc(categories.name))
        .limit(limit)
        .offset(offset)

      const totalCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(categories)

      return {
        categories: categoriesList,
        pagination: {
          page,
          limit,
          total: Number(totalCount[0].count),
          totalPages: Math.ceil(Number(totalCount[0].count) / limit),
        },
      }
    }),

  // Get single category by slug
  getCategory: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const category = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          createdAt: categories.createdAt,
        })
        .from(categories)
        .where(eq(categories.slug, input.slug))
        .limit(1)

      if (category.length === 0) {
        throw new Error('Category not found')
      }

      return category[0]
    }),

  // Create new category
  createCategory: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ input }) => {
      const slug = input.slug || generateSlug(input.name)

      // Check if slug already exists
      const existingCategory = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1)

      if (existingCategory) {
        throw new Error('Category with this slug already exists');
      }

      const newCategory = await db
        .insert(categories)
        .values({
          name: input.name,
          slug,
          description: input.description,
        })
        .returning()

      return newCategory[0]
    }),

  // Update category
  updateCategory: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input

      if (updateData.slug) {
        // Check if new slug already exists (excluding current category)
        const [existingCategory] = await db
          .select()
          .from(categories)
          .where(
            and(
              eq(categories.slug, updateData.slug),
              sql`${categories.id} != ${id}`
            )
          )
          .limit(1)

        if (existingCategory.length > 0) {
          throw new Error('Category with this slug already exists')
        }
      }

      const [updatedCategory] = await db
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, id))
        .returning()

      return updatedCategory
    }),

  // Delete category
  deleteCategory: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const [deletedCategory] = await db
        .delete(categories)
        .where(eq(categories.id, input.id))
        .returning()

      return deletedCategory
    }),
})
