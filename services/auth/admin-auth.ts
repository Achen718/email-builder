import { adminAuth } from '@/lib/firebase/admin-app';

export const verifyIdToken = async (idToken: string) => {
  try {
    return await adminAuth.verifyIdToken(idToken);
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Unauthorized');
  }
};
