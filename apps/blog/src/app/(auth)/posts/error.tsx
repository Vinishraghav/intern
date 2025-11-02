'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Posts error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-400 mb-6">
          {error.message || 'Failed to load posts. Please try again.'}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
