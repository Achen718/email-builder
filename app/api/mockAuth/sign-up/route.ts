import { mockSignUp } from '@/mocks/authMocks';

export async function POST(req: Request) {
  try {
    const { firstName, email, password } = await req.json();

    const response = await mockSignUp(firstName, email, password);
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: (error as Error).message }), {
      status: 400,
    });
  }
}
