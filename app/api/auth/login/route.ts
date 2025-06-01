import { NextResponse } from 'next/server';
import { authenticateUser } from '@/features/auth/api/login';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const { user, userToken, sessionCookie, expiresIn } =
      await authenticateUser(email, password);

    return NextResponse.json(
      {
        success: true,
        user,
        userToken,
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': `session=${sessionCookie}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${expiresIn};`,
        },
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 401 }
    );
  }
}
