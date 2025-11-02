import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/firebase-admin-ssr';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = request.headers.get('authorization')?.split('Bearer ')[1] ||
                 searchParams.get('token') ||
                 cookies().get('session')?.value;

    if (!token) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    const decodedToken = await verifySessionCookie(token);
    
    // Return minimal user info
    return NextResponse.json({
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
      }
    });
  } catch (error) {
    console.error('Error getting user session:', error);
    return NextResponse.json(
      { user: null },
      { status: 200 }
    );
  }
}
