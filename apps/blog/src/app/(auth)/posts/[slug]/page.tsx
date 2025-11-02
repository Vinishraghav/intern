import { notFound } from 'next/navigation';
import { sql } from '@/lib/db';
import Link from 'next/link';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: PageProps) {
  try {
    // First try to find by slug
    let result = await sql`
      SELECT p.*, u.name as author_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id::text
      WHERE p.slug = ${params.slug} AND p.published = true
      LIMIT 1
    `;

    // If not found by slug, try to find by ID (for backward compatibility)
    if (!result || result.length === 0) {
      const postId = parseInt(params.slug, 10);
      if (!isNaN(postId)) {
        result = await sql`
          SELECT p.*, u.name as author_name
          FROM posts p
          LEFT JOIN users u ON p.author_id = u.id::text
          WHERE p.id = ${postId} AND p.published = true
          LIMIT 1
        `;
      }
    }

    if (!result || result.length === 0) {
      notFound();
    }

    const post = result[0];

    return (
      <article className="min-h-screen bg-black text-white py-24">
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
              {post.author_name && (
                <span className="mr-4">By {post.author_name}</span>
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

          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </div>
      </article>
    );
  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }
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
