import { NextResponse } from 'next/server';
import { createUserDocument } from '@/features/users/api/create-user';

export async function POST(request: Request) {
  try {
    const { idToken, additionalUserData = {} } = await request.json();

    const result = await createUserDocument(idToken, additionalUserData);

    if (result.isNewUser) {
      console.log(`User document created for ${result.userId}`);
    } else {
      console.log(`User document already exists for ${result.userId}`);
    }

    return NextResponse.json({
      success: true,
      userId: result.userId,
      documentId: result.documentId,
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
