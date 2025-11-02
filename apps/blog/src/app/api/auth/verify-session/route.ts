import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { session } = await request.json();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session token is required' },
        { status: 400 }
      );
    }

    const auth = await getAdminAuth();
    if (!auth) {
      throw new Error('Failed to initialize Firebase Admin');
    }

    const decodedClaims = await auth.verifySessionCookie(session, true);
    return NextResponse.json({ uid: decodedClaims.uid });
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { error: 'Failed to verify session' },
      { status: 401 }
    );
  }
}
