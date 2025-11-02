'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type User = {
  id: string
  name: string
  email: string
  isDemo: boolean
} | null

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [pathname])

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
    setUser(null)
    router.push('/')
  }
  
  const handleProfileClick = (e: React.MouseEvent) => {
    // Always go to profile page
    router.push('/profile')
  }

  return (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-xl border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - BlogSpace */}
          <Link href="/" className="text-xl font-bold text-white">
            BlogSpace
          </Link>
          
          {/* Middle - Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-medium ${
                pathname === '/' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              href="/posts"
              className={`px-3 py-2 text-sm font-medium ${
                pathname.startsWith('/posts') ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Blog
            </Link>
          </div>
          
          {/* Right side - Auth */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  onClick={handleProfileClick}
                  className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                  title="View Profile"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/signin"
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
