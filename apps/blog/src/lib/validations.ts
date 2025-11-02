'use client'

import { z } from 'zod';
import { useState, useCallback } from 'react';

export const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase, alphanumeric with hyphens'
    ),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').optional(),
  categoryIds: z.array(z.string().or(z.number())).min(1, 'At least one category is required'),
  published: z.boolean().default(false),
  featuredImage: z.string().url('Must be a valid URL').optional(),
  tags: z.array(z.string()).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase, alphanumeric with hyphens'
    ),
  description: z.string().optional(),
});

// Helper function to validate form data
export async function validateFormData<T>(
  formData: FormData,
  schema: z.ZodSchema<T>
): Promise<{ data?: T; errors?: Record<string, string> }> {
  try {
    const data = Object.fromEntries(formData);
    
    // Handle array fields
    const formData: Record<string, any> = { ...data };
    
    if (formData.categoryIds) {
      formData.categoryIds = Array.isArray(formData.categoryIds) 
        ? formData.categoryIds 
        : [formData.categoryIds].filter(Boolean);
    }
    
    if (formData.tags) {
      formData.tags = Array.isArray(formData.tags) 
        ? formData.tags 
        : [formData.tags].filter(Boolean);
    }
    
    // Convert string 'true'/'false' to boolean
    if (typeof formData.published === 'string') {
      formData.published = formData.published === 'true';
    }
    
    const validatedData = await schema.parseAsync(formData);
    return { data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce<Record<string, string>>((acc, curr) => {
        const key = curr.path.join('.');
        acc[key] = curr.message;
        return acc;
      }, {});
      return { errors };
    }
    throw error;
  }
}

// Client-side validation hook
export function useFormValidation<T>(
  schema: z.ZodSchema<T>,
  defaultValues?: Partial<T>
) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback(
    async (name: string, value: unknown) => {
      try {
        // Create a schema that only validates the current field
        const fieldSchema = z.object({
          [name]: (schema as any).shape[name]
        });
        
        await fieldSchema.parseAsync({ [name]: value });
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors(prev => ({
            ...prev,
            [name]: error.errors[0]?.message || 'Invalid value',
          }));
        }
        return false;
      }
    },
    [schema]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setTouched(prev => ({ ...prev, [name]: true }));
      validateField(name, value);
    },
    [validateField]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent, onSubmit: (data: T) => Promise<void>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const result = await validateFormData(formData, schema);

      if (result.errors) {
        setErrors(result.errors);
        return;
      }

      if (result.data) {
        try {
          await onSubmit(result.data);
        } catch (error) {
          console.error('Form submission error:', error);
          setErrors({
            form: 'An error occurred while submitting the form. Please try again.',
          });
        }
      }
    },
    [schema]
  );

  return {
    errors,
    touched,
    validateField,
    handleBlur,
    handleSubmit,
    setErrors,
    setTouched,
  };
}
