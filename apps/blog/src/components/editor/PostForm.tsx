'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FiSave, FiEye, FiTrash2, FiCalendar, FiTag, FiChevronDown } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import Select from 'react-select';

import { RichTextEditor } from './RichTextEditor';
import { ImageUpload } from './ImageUpload';
import { postFormSchema, type PostFormValues } from './types';

// Mock categories - in a real app, these would come from your API
const MOCK_CATEGORIES = [
  { value: '1', label: 'Technology' },
  { value: '2', label: 'Programming' },
  { value: '3', label: 'Design' },
  { value: '4', label: 'Business' },
  { value: '5', label: 'Lifestyle' },
];

// Mock tags - in a real app, these would come from your API
const MOCK_TAGS = [
  { value: 'react', label: 'React' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'webdev', label: 'Web Development' },
  { value: 'ui', label: 'UI/UX' },
];

type PostFormProps = {
  initialData?: Partial<PostFormValues>;
  isEditing?: boolean;
};

export function PostForm({ initialData, isEditing = false }: PostFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [showSeoFields, setShowSeoFields] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Array<{ value: string; label: string }>>([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      categoryId: '',
      tags: [],
      metaTitle: '',
      metaDescription: '',
      published: false,
      publishedAt: new Date().toISOString(),
      ...initialData,
    },
  });

  const title = watch('title');
  const content = watch('content');
  const featuredImage = watch('featuredImage');
  const categoryId = watch('categoryId');
  const published = watch('published');
  const publishedAt = watch('publishedAt');

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !initialData?.slug) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // remove special characters
        .replace(/\s+/g, '-') // replace spaces with -
        .replace(/--+/g, '-') // replace multiple - with single -
        .trim();
      setValue('slug', slug);
    }
  }, [title, setValue, initialData?.slug]);

  // Set default meta title and description if not set
  useEffect(() => {
    if (!watch('metaTitle') && title) {
      setValue('metaTitle', title);
    }
    if (!watch('metaDescription') && watch('excerpt')) {
      setValue('metaDescription', watch('excerpt') || '');
    }
  }, [title, watch, setValue]);

  // Handle tags change
  const handleTagsChange = (selectedOptions: any) => {
    setSelectedTags(selectedOptions || []);
    setValue(
      'tags',
      selectedOptions ? selectedOptions.map((tag: any) => tag.value) : []
    );
  };

  // Handle form submission
  const onSubmit = async (data: PostFormValues) => {
    try {
      setIsSaving(true);
      
      // In a real app, you would make an API call here
      console.log('Submitting post:', data);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success(isEditing ? 'Post updated successfully!' : 'Post created successfully!');
      
      // Redirect to posts list
      router.push('/dashboard/posts');
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle preview
  const handlePreview = () => {
    // In a real app, this would open a preview in a new tab
    toast('Preview not implemented yet', { icon: '👀' });
  };

  // Handle delete
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      // In a real app, you would make an API call to delete the post
      toast.success('Post deleted successfully!');
      router.push('/dashboard/posts');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              {...register('title')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter post title..."
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                /posts/
              </span>
              <input
                type="text"
                id="slug"
                {...register('slug')}
                className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.slug ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="post-slug"
              />
            </div>
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              {...register('excerpt')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="A brief summary of your post..."
            />
            {errors.excerpt && (
              <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
            )}
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Featured Image
            </label>
            <ImageUpload
              value={featuredImage}
              onChange={(value) => setValue('featuredImage', value)}
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Content <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-500">
                {content?.length || 0} characters
              </span>
            </div>
            <RichTextEditor
              content={content || ''}
              onChange={(value) => setValue('content', value)}
              className={errors.content ? 'border-red-500' : ''}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3 space-y-6">
          {/* Publish Card */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Publish</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {published ? 'Published' : 'Draft'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Visibility:</span>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                defaultValue="public"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="password">Password Protected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publish Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={format(new Date(publishedAt || new Date()), "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => setValue('publishedAt', new Date(e.target.value).toISOString())}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSaving
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSaving ? (
                  'Saving...'
                ) : isEditing ? (
                  'Update Post'
                ) : (
                  'Publish Post'
                )}
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handlePreview}
                className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiEye className="h-4 w-4 mr-2" />
                Preview
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FiTrash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
            <select
              id="category"
              {...register('categoryId')}
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                errors.categoryId ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
            >
              <option value="">Select a category</option>
              {MOCK_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Tags
              <span className="ml-1 text-sm text-gray-500">(Optional)</span>
            </h3>
            <Select
              isMulti
              options={MOCK_TAGS}
              value={selectedTags}
              onChange={handleTagsChange}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select tags..."
            />
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSeoFields(!showSeoFields)}
              className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
            >
              <h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>
              <FiChevronDown
                className={`h-5 w-5 text-gray-400 transform transition-transform ${
                  showSeoFields ? 'rotate-180' : ''
                }`}
              />
            </button>
            {showSeoFields && (
              <div className="px-6 pb-6 space-y-4">
                <div>
                  <label
                    htmlFor="metaTitle"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Meta Title
                  </label>
                  <input
                    type="text"
                    id="metaTitle"
                    {...register('metaTitle')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Meta title for SEO"
                  />
                </div>
                <div>
                  <label
                    htmlFor="metaDescription"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Meta Description
                  </label>
                  <textarea
                    id="metaDescription"
                    {...register('metaDescription')}
                    rows={3}
                    maxLength={160}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Meta description for SEO (max 160 characters)"
                  />
                  <p className="mt-1 text-xs text-gray-500 text-right">
                    {watch('metaDescription')?.length || 0}/160 characters
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
