import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ status: 'success' });
  
  // Clear the session cookie
  response.cookies.set({
    name: 'session',
    value: '',
    maxAge: -1, // Expire immediately
    path: '/',
  });

  return response;
}
