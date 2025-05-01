import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Clear the session cookie
  cookies().delete('session');

  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        'Set-Cookie':
          'session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
      },
    }
  );
}
