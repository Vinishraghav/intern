// @ts-ignore - Next.js types will be available at runtime
import Link from 'next/link';
// @ts-ignore - Module will be available at runtime
import { sql } from '@/lib/db';

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
}

export default async function PostsPage() {
  let posts: Post[] = [];
  let errorMessage = '';
  
  try {
    console.log('Fetching posts from database...');
    
    // Test connection first
    await sql`SELECT 1 as test`;
    
    // Get all published posts
    const result = await sql`
      SELECT * FROM posts 
      WHERE published = true
      ORDER BY created_at DESC
    `;
    
    console.log('Query result:', result);
    
    if (Array.isArray(result)) {
      posts = result.map(post => ({
        ...post,
        created_at: new Date(post.created_at).toLocaleDateString(),
        updated_at: new Date(post.updated_at).toLocaleDateString()
      }));
      console.log(`Found ${posts.length} published posts`);
    }
    
  } catch (error) {
    const errorObj = error as Error;
    errorMessage = errorObj.message || 'Failed to load posts';
    console.error('Error details:', errorObj);
    
    // Return sample data if there's an error
    posts = [{
      id: '1',
      title: 'Sample Post',
      excerpt: 'This is a sample post to demonstrate the blog layout.',
      content: 'This is the content of the sample post. It will be displayed when you view the full post.',
      created_at: new Date().toLocaleDateString(),
      updated_at: new Date().toLocaleDateString(),
      slug: 'sample-post',
      published: true,
      author: 'Admin',
      cover_image: null
    }];
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
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
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
            <p>Error: {errorMessage}</p>
            <p className="text-sm mt-1">Showing sample data instead.</p>
          </div>
        )}
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article 
              key={post.id} 
              className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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
                    <span>By {post.author || 'Admin'}</span>
                    <span className="mx-2">•</span>
                    <time dateTime={post.created_at}>
                      {post.created_at}
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
          ))}
          
          {posts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">No posts found. Check back later for updates!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
