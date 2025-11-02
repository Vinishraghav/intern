import Link from 'next/link';
import { sql } from '@/lib/db';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  created_at: string;
  slug: string;
  published: boolean;
  cover_image?: string | null;
}

export default async function PostsPage() {
  let posts: Post[] = [];
  
  try {
    console.log('Attempting to connect to database...');
    // First, get the actual structure of the posts table
    const tableInfo = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'posts'
    `;
    console.log('Posts table structure:', tableInfo);

    // Get all posts (temporarily removing the published filter for debugging)
    const result = await sql`
      SELECT 
        id, 
        title, 
        excerpt, 
        created_at, 
        slug,
        published,
        cover_image
      FROM posts 
      WHERE published = true
      ORDER BY created_at DESC
    `;
    
    console.log('Raw database result:', JSON.stringify(result, null, 2));
    
    console.log('Query result:', result);
    
    if (result && Array.isArray(result)) {
      posts = result as Post[];
      console.log(`Found ${posts.length} posts`);
    } else {
      console.log('No posts found or unexpected result format:', result);
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Latest Posts
          </h1>
          <p className="text-gray-300 text-lg">Discover our latest articles and updates</p>
        </div>
      </div>
      
      {/* Posts grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article 
                key={post.id} 
                className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1"
              >
                <Link href={`/posts/${post.slug || post.id}`}>
                  <div className="h-48 overflow-hidden">
                    {post.cover_image ? (
                      <img 
                        src={post.cover_image} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Cover Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-400 mb-3">
                      <time dateTime={post.created_at} className="text-cyan-400">
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center text-cyan-400 text-sm font-medium">
                      Read more
                      <svg 
                        className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M14 5l7 7m0 0l-7 7m7-7H3" 
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">No posts found. Check back later for updates!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
