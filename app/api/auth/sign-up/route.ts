import { NextResponse } from 'next/server';
import { registerAuthUser } from '@/features/auth/api/sign-up';

export async function POST(request: Request) {
  try {
    const { displayName, email, password } = await request.json();

    const { user, userToken } = await registerAuthUser(
      displayName,
      email,
      password
    );

    return NextResponse.json({
      success: true,
      user,
      userToken,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
