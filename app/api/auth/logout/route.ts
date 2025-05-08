import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { logoutUser } from '@/features/auth/api/logout';

export async function POST() {
  try {
    // Clear the session cookie
    cookies().delete('session');

    const { cookieSetting } = logoutUser();

    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          'Set-Cookie': cookieSetting,
        },
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
