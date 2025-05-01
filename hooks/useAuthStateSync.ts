'use client';
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks/hooks';
import { auth } from '@/utils/firebase/firebaseUtils';
import { onAuthStateChanged } from 'firebase/auth';
import {
  setCredentials,
  clearCredentials,
} from '@/lib/features/auth/authSlice';

export function useAuthStateSync() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get token for API auth
          const idToken = await user.getIdToken();

          // Call your API to verify the token and create a session
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
          });

          // Update Redux store
          dispatch(
            setCredentials({
              user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
              },
              token: idToken,
            })
          );
        } catch (error) {
          console.error('Session verification failed', error);
          dispatch(clearCredentials());
        }
      } else {
        // User is signed out
        dispatch(clearCredentials());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
}
