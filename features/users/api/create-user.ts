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
  // Verify token & get user ID from token
  const decodedToken = await verifyIdToken(idToken);
  const uid = decodedToken.uid;

  // Get user data from auth
  const userRecord = await adminAuth.getUser(uid);

  // Reference to user document
  const userRef = adminDb.collection('users').doc(uid);

  // Check if user document already exists
  const userDoc = await userRef.get();

  let isNewUser = false;

  if (!userDoc.exists) {
    // Extract user data
    const { displayName, email } = userRecord;
    const createdAt = new Date();

    // Create the user document
    await userRef.set({
      displayName,
      email,
      createdAt,
      hasDefaultTemplates: true,
      ...additionalUserData,
    });

    // Add default templates for the new user
    await addDefaultTemplatesForUser(uid);
    isNewUser = true;
  }

  // Return all the data needed by the route handler
  return {
    success: true,
    userId: uid,
    documentId: userRef.id,
    isNewUser,
  };
}
