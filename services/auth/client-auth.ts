import { auth } from '@/lib/firebase/client-app';
import { signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

interface AuthResult {
  user: {
    email: string | null;
    displayName: string | null;
    uid: string;
  };
  userToken: string;
}

// Process user authentication and document creation
export const processUserAuthentication = async (
  user: User
): Promise<AuthResult> => {
  try {
    // Get ID token for API route authentication
    const idToken = await user.getIdToken();

    // Call API route to create/verify user document with Admin SDK
    const response = await fetch('/api/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to create user document');
    }

    // Return user data and token for Redux store
    return {
      user: {
        email: user.email,
        displayName: user.displayName,
        uid: user.uid,
      },
      userToken: idToken,
    };
  } catch (error) {
    console.error('Authentication processing failed:', error);
    throw error;
  }
};

// Google authentication utility
export const googleSignIn = async (): Promise<AuthResult> => {
  try {
    const { user } = await signInWithGooglePopup();
    return processUserAuthentication(user);
  } catch (error) {
    console.error('Google sign-in failed:', error);
    throw error;
  }
};
