import { adminAuth } from '@/lib/firebase/admin-app';

/**
 * Core user registration business logic, separated from the API route handler
 * This makes it independently testable and reusable
 */
export async function registerAuthUser(
  displayName: string,
  email: string,
  password: string
) {
  // Create the user with Firebase Admin SDK
  const userRecord = await adminAuth.createUser({
    email,
    password,
    displayName,
  });

  // Generate a custom token for this user
  const customToken = await adminAuth.createCustomToken(userRecord.uid);

  // Exchange custom token for ID token (needed for client-side auth)
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: customToken,
        returnSecureToken: true,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Token exchange failed');
  }

  const idToken = data.idToken;

  // Return all the data needed by the route handler
  return {
    user: {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
    },
    userToken: idToken,
  };
}
