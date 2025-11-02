'use client'

import { useState, useEffect } from 'react'
// @ts-ignore - Next.js types will be available at runtime
import Link from 'next/link'
import { format } from 'date-fns'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  created_at: string
  updated_at: string
  published: boolean
  cover_image?: string | null
}

// Demo user data
const demoUser = {
  id: 'demo-user-123',
  name: 'Demo User',
  email: 'demo@example.com',
  bio: 'This is a demo user account. Sign in to create your own profile!',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoUser',
  joinDate: '2023-01-01T00:00:00Z',
  stats: {
    posts: 2,
    likes: 24,
    followers: 10,
    following: 5
  }
}

// Sample posts data
const samplePosts = [
  {
    id: '1',
    title: 'Sample Post 1',
    slug: 'sample-post-1',
    excerpt: 'This is a sample post to demonstrate the profile page.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published: true,
    cover_image: 'https://source.unsplash.com/random/800x400?blog'
  },
  {
    id: '2',
    title: 'Sample Post 2',
    slug: 'sample-post-2',
    excerpt: 'Another sample post to show multiple posts in the profile.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published: true,
    cover_image: 'https://source.unsplash.com/random/800x401?tech'
  }
]

export default function ProfilePage() {
  const [posts, setPosts] = useState(samplePosts)
  const [loading, setLoading] = useState(false)

  const handleDelete = (postId: string) => {
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
  }

  const handleDelete = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/posts?id=${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPosts(posts.filter(p => p.id !== postId))
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      alert('Error deleting post')
    }
  }

  // No need for logout in demo version
  const handleLogout = () => {
    // This is a demo, so we'll just go to the home page
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <img
              className="h-32 w-32 rounded-full object-cover border-4 border-indigo-100"
              src={demoUser.avatar}
              alt={demoUser.name}
            />
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{demoUser.name}</h1>
              <p className="text-gray-600">{demoUser.email}</p>
              <p className="mt-2 text-gray-700">{demoUser.bio}</p>
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                <div className="text-center">
                  <p className="text-lg font-semibold">{demoUser.stats.posts}</p>
                  <p className="text-sm text-gray-600">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{demoUser.stats.followers}</p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{demoUser.stats.following}</p>
                  <p className="text-sm text-gray-600">Following</p>
                </div>
              </div>
            </div>
          </div>
        </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600 mt-1">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <Link
            href="/posts/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            + Create New Post
          </Link>
          <Link
            href="/posts"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            View All Posts
          </Link>
        </div>

        {/* User's Posts */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            My Posts ({posts.length})
          </h2>

          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-6">Start writing your first blog post</p>
              <Link
                href="/posts/new"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          post.published 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      View
                    </Link>
                    <Link
                      href={`/posts/${post.slug}/edit`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
