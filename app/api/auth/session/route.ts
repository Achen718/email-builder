import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/utils/firebase/firebaseAdminUtils';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Get session cookie
    const sessionCookie = cookies().get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify session
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    const uid = decodedClaims.uid;

    // Get user data from Firestore
    const userDoc = await adminDb.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({
        authenticated: true,
        user: { uid, email: decodedClaims.email },
      });
    }

    // Return user data from Firestore
    return NextResponse.json({
      authenticated: true,
      user: {
        uid,
        ...userDoc.data(),
      },
    });
  } catch (error) {
    // Invalid or expired session
    cookies().delete('session');
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
