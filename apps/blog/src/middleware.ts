import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionCookie } from './lib/firebase-admin-ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('session')?.value;
  
  // Public paths that don't require authentication
  const publicPaths = ['/signin', '/signup', '/', '/posts'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Verify Firebase session
  let user = null;
  if (token) {
    try {
      const decodedToken = await verifySessionCookie(token);
      user = decodedToken;
      
      // Add user info to request headers for API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-uid', user.uid);
      requestHeaders.set('x-email', user.email || '');
      
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      
      return response;
    } catch (error) {
      console.error('Error verifying session cookie:', error);
      // Clear invalid cookie
      const response = NextResponse.next();
      response.cookies.delete('session');
      return response;
    }
  }

  // If user is logged in and tries to access auth pages, redirect to posts
  if (user && (pathname === '/signin' || pathname === '/signup' || pathname === '/')) {
    return NextResponse.redirect(new URL('/posts', request.url));
  }

  // Protected routes
  const protectedPaths = ['/profile', '/posts/new', '/posts/edit'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  // Redirect to signin if trying to access protected route without auth
  if (isProtectedPath && !token) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
