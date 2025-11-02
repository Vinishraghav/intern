import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
      <p className="text-gray-400 mb-8">The post you're looking for doesn't exist or has been removed.</p>
      <Link 
        href="/posts" 
        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors"
      >
        Back to Posts
      </Link>
    </div>
  );
}
