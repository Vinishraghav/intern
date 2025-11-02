import { z } from 'zod'

// Utility function to generate slugs
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 255) // Limit length
}

// Enhanced slug validation
const slugSchema = z.string()
  .min(1, 'Slug is required')
  .max(255, 'Slug must be less than 255 characters')
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
  .refine((slug) => !slug.startsWith('-') && !slug.endsWith('-'), 'Slug cannot start or end with hyphens')
  .refine((slug) => slug.length > 0, 'Slug cannot be empty')

// Post schemas
export const postSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim()
    .refine((title) => title.length > 0, 'Title cannot be empty'),
  content: z.string()
    .min(1, 'Content is required')
    .max(50000, 'Content is too long (max 50,000 characters)')
    .refine((content) => content.trim().length > 0, 'Content cannot be empty'),
  excerpt: z.string()
    .max(500, 'Excerpt must be less than 500 characters')
    .optional()
    .refine((excerpt) => !excerpt || excerpt.trim().length > 0, 'Excerpt cannot be empty if provided'),
  author: z.string()
    .min(1, 'Author is required')
    .max(100, 'Author must be less than 100 characters')
    .trim()
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Author name contains invalid characters')
    .refine((author) => author.length > 0, 'Author cannot be empty'),
  published: z.boolean().default(false),
  categoryIds: z.array(z.string().uuid('Invalid category ID'))
    .max(10, 'Cannot assign more than 10 categories')
    .optional()
    .default([]),
})

export const createPostSchema = postSchema.extend({
  slug: slugSchema.optional(),
})

export const updatePostSchema = postSchema.partial().extend({
  id: z.string().uuid('Invalid post ID'),
  slug: slugSchema.optional(),
})

// Category schemas
export const categorySchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .regex(/^[a-zA-Z0-9\s\-&'()]+$/, 'Category name contains invalid characters')
    .refine((name) => name.length > 0, 'Category name cannot be empty'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .refine((desc) => !desc || desc.trim().length > 0, 'Description cannot be empty if provided'),
})

export const createCategorySchema = categorySchema.extend({
  slug: slugSchema.optional(),
})

export const updateCategorySchema = categorySchema.partial().extend({
  id: z.string().uuid('Invalid category ID'),
  slug: slugSchema.optional(),
})

// Query schemas with enhanced validation
export const postsQuerySchema = z.object({
  page: z.number()
    .min(1, 'Page must be at least 1')
    .max(1000, 'Page cannot exceed 1000')
    .optional()
    .default(1),
  limit: z.number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(10),
  category: z.string()
    .uuid('Invalid category ID')
    .optional(),
  search: z.string()
    .max(100, 'Search term too long')
    .optional()
    .refine((search) => !search || search.trim().length >= 2, 'Search term must be at least 2 characters')
    .transform((search) => search?.trim()),
  includeDrafts: z.boolean().optional().default(false),
})

export const categoriesQuerySchema = z.object({
  page: z.number()
    .min(1, 'Page must be at least 1')
    .max(1000, 'Page cannot exceed 1000')
    .optional()
    .default(1),
  limit: z.number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(10),
})

// Types
export type PostInput = z.infer<typeof createPostSchema>
export type PostUpdate = z.infer<typeof updatePostSchema>
export type CategoryInput = z.infer<typeof createCategorySchema>
export type CategoryUpdate = z.infer<typeof updateCategorySchema>
export type PostsQuery = z.infer<typeof postsQuerySchema>
export type CategoriesQuery = z.infer<typeof categoriesQuerySchema>
