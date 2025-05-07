import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/login/route';
import { adminAuth } from '@/lib/firebase/admin-app';

// Mock Firebase Admin SDK
jest.mock('@/lib/firebase/admin-app', () => ({
  adminAuth: {
    createSessionCookie: jest.fn().mockResolvedValue('mocked-session-cookie'),
  },
}));

jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    ...originalModule,
    NextResponse: {
      ...originalModule.NextResponse,
      json: <T>(data: T, init?: ResponseInit) => {
        return new Response(JSON.stringify(data), init);
      },
    },
  };
});

// Mock global fetch
global.fetch = jest.fn();
const mockFetchResponse = {
  ok: true,
  json: jest.fn(),
};
(global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

describe('Login API Route', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchResponse.json.mockReset();
    mockFetchResponse.ok = true;

    // Setup test environment variables
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_FIREBASE_API_KEY: 'test-api-key',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test('should authenticate user with valid credentials', async () => {
    const fakeCredential = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockRequest = new NextRequest(
      'http://localhost:3000/api/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fakeCredential),
      }
    );

    mockFetchResponse.json.mockResolvedValueOnce({
      idToken: 'mock-id-token',
      localId: 'user123',
      email: 'test@example.com',
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(global.fetch).toHaveBeenCalledWith(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=test-api-key`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          returnSecureToken: true,
        }),
      })
    );

    expect(adminAuth.createSessionCookie).toHaveBeenCalledWith(
      'mock-id-token',
      {
        expiresIn: 60 * 60 * 24 * 5 * 1000,
      }
    );

    expect(data).toEqual({
      success: true,
      user: { uid: 'user123', email: 'test@example.com' },
      userToken: 'mock-id-token',
    });

    // Check cookie was set correctly
    const cookieHeader = response.headers.get('Set-Cookie');
    expect(cookieHeader).toContain('session=mocked-session-cookie');
    expect(cookieHeader).toContain('HttpOnly');
    expect(cookieHeader).toContain('Secure');
  });

  test('should return error for invalid credentials', async () => {
    const mockRequest = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    });

    // Mock failed authentication response
    mockFetchResponse.ok = false;
    mockFetchResponse.json.mockResolvedValueOnce({
      error: { message: 'INVALID_PASSWORD' },
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({
      success: false,
      error: 'INVALID_PASSWORD',
    });
    expect(adminAuth.createSessionCookie).not.toHaveBeenCalled();
  });

  test('should handle malformed request body', async () => {
    const mockRequest = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'not-valid-json',
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBeTruthy();
  });

  test('should handle Firebase server errors', async () => {
    const mockRequest = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    // Make fetch throw a network error
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network failure')
    );

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({
      success: false,
      error: 'Network failure',
    });
  });

  test('should handle session cookie creation failure', async () => {
    const mockRequest = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    mockFetchResponse.json.mockResolvedValueOnce({
      idToken: 'mock-id-token',
      localId: 'user123',
      email: 'test@example.com',
    });

    // Make session cookie creation fail
    (adminAuth.createSessionCookie as jest.Mock).mockRejectedValueOnce(
      new Error('Invalid ID token')
    );

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({
      success: false,
      error: 'Invalid ID token',
    });
  });
});
