import { mockLogin } from '@/mocks/authMocks';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const response = await mockLogin(email, password);
    return Response.json(response, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: (error as Error).message },
      { status: 401 }
    );
  }
}
