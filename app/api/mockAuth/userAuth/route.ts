import { fetchMockUserData, verifyToken } from '@/mocks/authMocks';

export async function GET(req: Request) {
  try {
    console.log('Received request:', req);
    const authHeader = req.headers.get('Authorization');
    console.log('Authorization header:', authHeader);
    if (!authHeader) {
      console.log('Authorization header missing');
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token);
    const email = verifyToken(token);
    console.log('Verified email:', email);
    if (!email) {
      console.log('Token verification failed');
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const user = await fetchMockUserData(token);
    console.log('Fetched user data:', user);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
