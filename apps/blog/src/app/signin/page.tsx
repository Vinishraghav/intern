'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo credentials
    if (email === 'demo@example.com' && password === 'demo123') {
      // Store demo user in localStorage
      const demoUser = {
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@example.com',
        isDemo: true
      };
      
      localStorage.setItem('user', JSON.stringify(demoUser));
      router.push('/posts');
    } else {
      setError('Invalid credentials. Use demo@example.com / demo123');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-white mb-8 text-center">Sign In</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="demo@example.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-2.5 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-400">
            <p>Demo credentials:</p>
            <p className="font-mono mt-1">demo@example.com / demo123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
