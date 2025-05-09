import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  verifyUserSession,
  createUserSession,
} from '@/features/auth/api/session';

export async function GET() {
  const sessionCookie = cookies().get('session')?.value;
  const result = await verifyUserSession(sessionCookie);

  if (result.shouldClearCookie) {
    cookies().delete('session');
  }

  return NextResponse.json(
    { authenticated: result.authenticated, user: result.user },
    { status: result.authenticated ? 200 : 401 }
  );
}

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    // Add logging to verify unique tokens
    console.log(
      `Creating session for token hash: ${idToken.substring(0, 10)}...`
    );

    const sessionResult = await createUserSession(idToken);

    if (!sessionResult.success) {
      console.error('Session creation error:', sessionResult.error);
      return NextResponse.json(
        { success: false, error: sessionResult.error },
        { status: 401 }
      );
    }

    console.log(`Creating session for user: ${sessionResult.uid}`);

    // Use the cookies API to set the session cookie
    cookies().set('session', sessionResult.sessionCookie || '', {
      maxAge: (sessionResult.expiresIn || 3600) / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
    });

    // Set user ID in a separate (less secure) cookie for debugging
    cookies().set('debug_uid', sessionResult.uid || '', {
      maxAge: (sessionResult.expiresIn || 3600) / 1000,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session processing error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
