const path = require('path');
const webpack = require('webpack');

// Load environment variables
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable server components external packages as it can cause issues
  experimental: {
    esmExternals: 'loose',
  },
  
  // Explicitly expose environment variables to the browser
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    POSTGRES_URL: process.env.POSTGRES_URL,
  },

  // CORS and security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
        ],
      },
    ];
  },
  
  // Configure webpack
  webpack: (config, { isServer, buildId, dev }) => {
    // Only apply these changes for server-side code
    if (isServer) {
      // Handle Node.js built-in modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        'firebase-admin/app': false,
        'firebase-admin/auth': false,
      };

      // Add polyfills for Node.js modules
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^node:/,
          (resource) => {
            resource.request = resource.request.replace(/^node:/, '');
          }
        )
      );
    }

    // Add path aliases
    const customAliases = {
      '@': path.resolve(__dirname, 'src'),
      '@ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@db': path.resolve(__dirname, '../../services/db/src'),
      '@hooks': path.resolve(__dirname, '../../libraries/hooks/src'),
      '@workspace/trpc': path.resolve(__dirname, '../../services/trpc/src'),
      '@workspace/db': path.resolve(__dirname, '../../services/db/src'),
    };
    
    // Add fallbacks for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "process": require.resolve("process/browser"),
      "buffer": require.resolve("buffer"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util"),
      "url": require.resolve("url"),
      "querystring": require.resolve("querystring-es3"),
      "path": require.resolve("path-browserify"),
      "fs": false,
    };

    // Provide process global
    config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      })
    );

    config.resolve.alias = {
      ...config.resolve.alias,
      ...customAliases
    };

    // Important: return the modified config
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/trpc/:path*',
        destination: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_TRPC_URL
          ? `${process.env.NEXT_PUBLIC_TRPC_URL}/trpc/:path*`
          : 'http://localhost:3001/trpc/:path*',
      },
    ]
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Remove console logs in production
  },
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Bundle analysis (enabled when ANALYZE=true)
  ...(process.env.ANALYZE === 'true' && {
    bundleAnalyzer: {
      enabled: true,
      openAnalyzer: true,
    },
  }),
}

module.exports = nextConfig
