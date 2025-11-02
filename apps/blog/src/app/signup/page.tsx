'use client'

import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { 
  auth, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult,
  type User
} from '@/lib/firebase-client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Icons } from '@/components/icons';

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push('/posts')
    } catch (error: any) {
      setError(error.message || 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  // Handle Google redirect result
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          router.push(redirectTo);
        }
      } catch (error: any) {
        setError(error.message || 'Google sign in failed');
      } finally {
        setLoading(false);
      }
    };
    
    handleRedirect();
  }, [router, redirectTo]);

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setError('');
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  }

  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get('redirect') || '/posts'

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Left side with cover image */}
      <div className="hidden lg:flex flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 z-10"></div>
        <img
          src="/images/auth-cover.jpg"
          alt="Cover"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-between p-12 z-20">
          <div>
            <h2 className="text-3xl font-bold text-white">BlogSpace</h2>
          </div>
          <div className="max-w-md">
            <div className="p-2 bg-black/30 backdrop-blur-sm inline-block rounded-lg mb-4">
              <p className="text-sm text-white">"The best way to predict the future is to create it."</p>
            </div>
            <p className="text-gray-300 text-sm">- Peter Drucker</p>
          </div>
        </div>
      </div>

      {/* Right side with sign up form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Sign up to get started with BlogSpace</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? (
              <Icons.spinner className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
            ) : (
              <Icons.google className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
            Continue with Google
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-gray-800 text-gray-400 text-xs">OR</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignUp} className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {loading ? (
                <>
                  <Icons.spinner className="h-4 w-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-4 text-center text-xs">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link 
                href={`/signin${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                className="text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
