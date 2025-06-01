import { adminAuth, adminDb } from '@/lib/firebase/admin-app';
import { verifyIdToken } from '@/services/auth/admin-auth';

/**
 * Verifies a session cookie and retrieves the associated user data
 */
export async function verifyUserSession(sessionCookie: string | undefined) {
  if (!sessionCookie) {
    return { authenticated: false };
  }

  try {
    // Verify session
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    const uid = decodedClaims.uid;

    const userDoc = await adminDb.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return {
        authenticated: true,
        user: { uid, email: decodedClaims.email },
      };
    }

    // Return user data from Firestore
    return {
      authenticated: true,
      user: {
        uid,
        ...userDoc.data(),
      },
    };
  } catch (error) {
    // validate session
    return {
      authenticated: false,
      shouldClearCookie: true,
    };
  }
}

/**
 * Creates a session cookie from an ID token
 */
export async function createUserSession(idToken: string) {
  try {
    // Verify the ID token    const decodedToken = await verifyIdToken(idToken);
    const decodedToken = await verifyIdToken(idToken);

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    return {
      success: true,
      sessionCookie,
      expiresIn,
      uid: decodedToken.uid,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Session creation failed',
    };
  }
}
