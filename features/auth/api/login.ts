import { adminAuth } from '@/lib/firebase/admin-app';

/**
 * Core login business logic, separated from the API route handler
 * This makes it independently testable and reusable
 */
export async function authenticateUser(email: string, password: string) {
  // Use Firebase Auth REST API to authenticate
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Authentication failed');
  }

  const idToken = data.idToken;
  const uid = data.localId;

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn,
  });

  // Return all the data needed by the route handler
  return {
    user: { uid, email },
    userToken: idToken,
    sessionCookie,
    expiresIn,
  };
}
