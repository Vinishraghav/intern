// This file is for server-side Firebase Admin operations only
// It should only be imported in API routes or getServerSideProps

// Use dynamic import to avoid webpack bundling issues
let firebaseAdmin: any;
let auth: any;

async function getFirebaseAdmin() {
  if (firebaseAdmin && auth) {
    return { auth };
  }

  // Use dynamic import to avoid webpack bundling
  const { initializeApp, cert } = await import('firebase-admin/app');
  const { getAuth } = await import('firebase-admin/auth');

  // Initialize Firebase Admin
  if (!firebaseAdmin) {
    firebaseAdmin = initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    
    auth = getAuth(firebaseAdmin);
  }

  return { auth };
}

export async function verifySessionCookie(sessionCookie: string) {
  const { auth } = await getFirebaseAdmin();
  return auth.verifySessionCookie(sessionCookie, true);
}

export async function createSessionCookie(idToken: string, expiresIn: number) {
  const { auth } = await getFirebaseAdmin();
  return auth.createSessionCookie(idToken, { expiresIn });
}

export async function getUser(uid: string) {
  const { auth } = await getFirebaseAdmin();
  return auth.getUser(uid);
}
