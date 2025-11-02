import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';

let _app: App | null = null;
let _auth: Auth | null = null;

interface FirebaseAdmin {
  app: App | null;
  auth: Auth | null;
}

// Use a function to initialize and get the Firebase Admin instances
export async function getFirebaseAdmin(): Promise<FirebaseAdmin> {
  if (_app && _auth) {
    return { app: _app, auth: _auth };
  }

  // Only run on server
  if (typeof window !== 'undefined') {
    return { app: null, auth: null };
  }

  try {
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\\\n/g, '\n');
    
    if (!privateKey || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
      console.error('Missing required Firebase Admin environment variables');
      return { app: null, auth: null };
    }

    if (!_app) {
      _app = getApps().length === 0
        ? initializeApp({
            credential: cert({
              projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
              clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
              privateKey,
            }),
          })
        : getApps()[0];
      
      _auth = getAuth(_app);
    }

    return { app: _app, auth: _auth };
  } catch (error) {
    console.error('Firebase admin initialization error', error);
    return { app: null, auth: null };
  }
}

// Export a function to get the auth instance
export async function getAdminAuth(): Promise<Auth | null> {
  const { auth } = await getFirebaseAdmin();
  return auth;
}

// Helper to create a session cookie
export async function createSessionCookie(idToken: string, expiresIn: number): Promise<string> {
  const auth = await getAdminAuth();
  if (!auth) throw new Error('Firebase Admin not initialized');
  return auth.createSessionCookie(idToken, { expiresIn });
}

// Helper to verify a session cookie
export async function verifySessionCookie(sessionCookie: string): Promise<any> {
  const auth = await getAdminAuth();
  if (!auth) throw new Error('Firebase Admin not initialized');
  return auth.verifySessionCookie(sessionCookie, true);
}

// Helper to get user by UID
export async function getUser(uid: string) {
  const auth = await getAdminAuth();
  if (!auth) throw new Error('Firebase Admin not initialized');
  return auth.getUser(uid);
}
