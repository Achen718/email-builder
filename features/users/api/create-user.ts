import { adminAuth, adminDb } from '@/lib/firebase/admin-app';
import { addDefaultTemplatesForUser } from '@/features/templates/services/default-templates';
import { verifyIdToken } from '@/services/auth/admin-auth';

/**
 * Core user document creation logic, separated from the API route handler
 * This makes it independently testable and reusable
 */
export async function createUserDocument(
  idToken: string,
  additionalUserData = {}
) {
  const decodedToken = await verifyIdToken(idToken);
  const uid = decodedToken.uid;

  const userRecord = await adminAuth.getUser(uid);

  const userRef = adminDb.collection('users').doc(uid);

  const userDoc = await userRef.get();

  let isNewUser = false;
  if (!userDoc.exists) {
    const { displayName, email } = userRecord;
    const createdAt = new Date();

    await userRef.set({
      displayName,
      email,
      createdAt,
      hasDefaultTemplates: true,
      ...additionalUserData,
    });

    await addDefaultTemplatesForUser(uid);
    isNewUser = true;
  }

  return {
    success: true,
    userId: uid,
    documentId: userRef.id,
    isNewUser,
  };
}
