import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin-app';
import { cookies } from 'next/headers';
import { verifyIdToken } from '@/services/auth/admin-auth';

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

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    // Add logging to verify unique tokens
    console.log(
      `Creating session for token hash: ${idToken.substring(0, 10)}...`
    );

    // Verify the ID token
    const decodedToken = await verifyIdToken(idToken);
    console.log(`Creating session for user: ${decodedToken.uid}`);

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    // Use the cookies API instead of headers
    cookies().set('session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
    });

    // set user ID in a separate (less secure) cookie for debugging
    cookies().set('debug_uid', decodedToken.uid, {
      maxAge: expiresIn / 1000,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 401 }
    );
  }
}
