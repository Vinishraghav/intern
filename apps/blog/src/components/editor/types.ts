import { z } from 'zod';

export const postFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug is too long'),
  excerpt: z.string().max(200, 'Excerpt is too long').optional(),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  published: z.boolean().default(false),
  publishedAt: z.string().optional(),
});

export type PostFormValues = z.infer<typeof postFormSchema>;
