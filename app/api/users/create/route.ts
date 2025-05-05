import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin-app';
import { addDefaultTemplatesForUser } from '@/features/templates/services/default-templates';

export async function POST(request: Request) {
  try {
    const { idToken, additionalUserData = {} } = await request.json();

    // Verify token & create user document with Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Get user data from auth
    const userRecord = await adminAuth.getUser(uid);

    // Reference to user document
    const userRef = adminDb.collection('users').doc(uid);

    // Check if user document already exists
    const userDoc = await userRef.get();

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

      await addDefaultTemplatesForUser(uid);
      console.log(`User document created for ${uid}`);

      // Call distributeTemplates only for this specific user
      // await distributeTemplatesForUser(uid);
    } else {
      console.log(`User document already exists for ${uid}`);
    }

    return NextResponse.json({
      success: true,
      userId: uid,
      documentId: userRef.id,
    });
  } catch (error) {
    console.error('Error creating user document:', error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 400 }
    );
  }
}
