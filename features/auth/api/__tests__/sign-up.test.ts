import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/sign-up/route';
import { adminAuth } from '@/lib/firebase/admin-app';

jest.mock('@/lib/firebase/admin-app', () => ({
  adminAuth: {
    createUser: jest.fn(),
    createCustomToken: jest.fn(),
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

describe('Sign-up API Route', () => {
  const originalEnv = process.env;
  const mockUserRecord = {
    uid: 'new-user-123',
    email: 'new@example.com',
    displayName: 'New User',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchResponse.json.mockReset();
    mockFetchResponse.ok = true;

    // Setup mock implementations specific to sign-up
    (adminAuth.createUser as jest.Mock).mockResolvedValue(mockUserRecord);
    (adminAuth.createCustomToken as jest.Mock).mockResolvedValue(
      'mock-custom-token'
    );

    // Setup test environment variables
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_FIREBASE_API_KEY: 'test-api-key',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test('should create new user and return tokens', async () => {
    const newUserData = {
      email: 'new@example.com',
      password: 'securepass123',
      displayName: 'New User',
    };

    const mockRequest = new NextRequest(
      'http://localhost:3000/api/auth/sign-up',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      }
    );

    mockFetchResponse.json.mockResolvedValueOnce({
      idToken: 'mock-id-token',
      refreshToken: 'mock-refresh-token',
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    // Verify user creation was called with correct data
    expect(adminAuth.createUser).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'securepass123',
      displayName: 'New User',
    });

    // Verify custom token was created for the new user
    expect(adminAuth.createCustomToken).toHaveBeenCalledWith('new-user-123');

    // Verify token exchange request
    expect(global.fetch).toHaveBeenCalledWith(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=test-api-key`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          token: 'mock-custom-token',
          returnSecureToken: true,
        }),
      })
    );

    // Verify response structure
    expect(data).toEqual({
      success: true,
      user: {
        uid: 'new-user-123',
        email: 'new@example.com',
        displayName: 'New User',
      },
      userToken: 'mock-id-token',
    });
  });

  test('should handle user creation failure', async () => {
    const newUserData = {
      email: 'existing@example.com',
      password: 'password123',
      displayName: 'Existing User',
    };

    const mockRequest = new NextRequest(
      'http://localhost:3000/api/auth/sign-up',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      }
    );

    // Mock user creation failure (email already exists)
    (adminAuth.createUser as jest.Mock).mockRejectedValueOnce(
      new Error('The email address is already in use by another account.')
    );

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: 'The email address is already in use by another account.',
    });

    // Custom token should not have been generated
    expect(adminAuth.createCustomToken).not.toHaveBeenCalled();
    // Fetch should not have been called
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('should handle token exchange failure', async () => {
    const newUserData = {
      email: 'new@example.com',
      password: 'password123',
      displayName: 'New User',
    };

    const mockRequest = new NextRequest(
      'http://localhost:3000/api/auth/sign-up',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      }
    );

    // Mock fetch failure during token exchange
    mockFetchResponse.ok = false;
    mockFetchResponse.json.mockResolvedValueOnce({
      error: { message: 'INVALID_CUSTOM_TOKEN' },
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBeTruthy();
  });

  test('should handle malformed request body', async () => {
    const mockRequest = new NextRequest(
      'http://localhost:3000/api/auth/sign-up',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'not-valid-json',
      }
    );

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBeTruthy();
  });

  test('should handle missing required fields', async () => {
    const incompleteUserData = {
      email: 'incomplete@example.com',
      // missing password and displayName
    };

    const mockRequest = new NextRequest(
      'http://localhost:3000/api/auth/sign-up',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incompleteUserData),
      }
    );

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});
