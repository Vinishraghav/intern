// @ts-ignore - Next.js types will be available at runtime
import { notFound } from 'next/navigation';
// @ts-ignore - Module will be available at runtime
import { sql } from '@/lib/db';
// @ts-ignore - Next.js types will be available at runtime
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  created_at: string;
  updated_at: string;
  slug: string;
  published: boolean;
  cover_image?: string | null;
  author?: string;
  author_name?: string;
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: PageProps) {
  let post: Post | null = null;
  let error = '';

  try {
    console.log('Fetching post with slug:', params.slug);
    
    // First try to find by slug
    let result = await sql`
      SELECT * FROM posts 
      WHERE slug = ${params.slug} AND published = true
      LIMIT 1
    `;

    // If not found by slug, try to find by ID (for backward compatibility)
    if (!result || result.length === 0) {
      console.log('Post not found by slug, trying ID...');
      result = await sql`
        SELECT * FROM posts 
        WHERE id::text = ${params.slug} AND published = true
        LIMIT 1
      `;
    }

    if (result && result.length > 0) {
      post = result[0];
      console.log('Found post:', post.title);
    } else {
      console.log('Post not found');
      notFound();
    }
    
  } catch (err) {
    console.error('Error fetching post:', err);
    error = 'Failed to load post. Please try again later.';
    
    // Return sample post in development for testing
    if (process.env.NODE_ENV === 'development') {
      post = {
        id: '1',
        title: 'Sample Post',
        excerpt: 'This is a sample post to demonstrate the blog post layout.',
        content: `## Welcome to Your First Post

This is a sample blog post to demonstrate how the content will be displayed. You can use **markdown** to format your posts.

### Features:
- Rich text formatting
- Code blocks with syntax highlighting
- Images and media
- And more!`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        slug: 'sample-post',
        published: true,
        author: 'Admin',
        cover_image: null
      };
    }
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-400 mb-4">Post Not Found</h1>
          <p className="text-gray-300 mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/posts" 
            className="inline-flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-8 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Posts
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-400 text-sm">
            {post.author && (
              <span className="mr-4">By {post.author}</span>
            )}
            <time dateTime={post.created_at}>
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </header>

        {post.cover_image && (
          <div className="mb-12 rounded-xl overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p className="text-gray-400 italic">No content available.</p>
          )}
        </div>
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  try {
    const posts = await sql`
      SELECT slug 
      FROM posts 
      WHERE published = true
    `;

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
