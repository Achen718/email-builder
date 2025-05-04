'use client';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/lib/hooks/hooks';
import { auth } from '@/lib/firebase/client-app';
import { onAuthStateChanged } from 'firebase/auth';
import {
  setCredentials,
  clearCredentials,
  setAuthLoading,
} from '@/features/auth/auth-slice';
import { useCreateSessionMutation } from '@/features/auth/auth-api';

export function useAuthStateSync() {
  const dispatch = useAppDispatch();
  const [createSession] = useCreateSessionMutation();

  useEffect(() => {
    dispatch(setAuthLoading(true));

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get token for API auth
          const idToken = await user.getIdToken();

          await createSession({ idToken }).unwrap();

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
  }, [dispatch, createSession]);
}
