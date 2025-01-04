import { fetchMockTemplates } from '@/mocks/apiMocks';

export async function GET(req: Request) {
  try {
    const templates = await fetchMockTemplates();
    return new Response(JSON.stringify(templates), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: (error as Error).message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
