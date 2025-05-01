import { NextResponse } from 'next/server';
import { adminAuth } from '@/utils/firebase/firebaseAdminUtils';

export async function POST(request: Request) {
  try {
    const { firstName, email, password } = await request.json();

    // Create the user with Firebase Admin SDK
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: firstName,
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
    const idToken = data.idToken;

    // Return the user data
    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      },
      userToken: idToken,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
