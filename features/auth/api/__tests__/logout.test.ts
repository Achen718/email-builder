import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { POST } from '@/app/api/auth/logout/route';

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    delete: jest.fn(),
  })),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body, options) => ({
      body,
      ...options,
    })),
  },
}));

jest.mock('@/features/auth/api/logout', () => {
  return {
    logoutUser: jest.fn().mockReturnValue({
      cookieSetting:
        'session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
    }),
  };
});

const mockLogoutUser = jest.requireMock(
  '@/features/auth/api/logout'
).logoutUser;

describe('Logout API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should delete session cookie', async () => {
    const mockDelete = jest.fn();
    (cookies as jest.Mock).mockReturnValue({
      delete: mockDelete,
    });

    await POST();

    expect(mockDelete).toHaveBeenCalledWith('session');
  });
  test('should return success response with cookie clearing header', async () => {
    const response = await POST();

    expect(NextResponse.json).toHaveBeenCalledWith(
      { success: true },
      {
        status: 200,
        headers: {
          'Set-Cookie':
            'session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
        },
      }
    );
  });
  test('should handle errors from cookie operations', async () => {
    const mockError = new Error('Cookie operation failed');
    (cookies as jest.Mock).mockImplementation(() => {
      throw mockError;
    });
    await POST();

    expect(NextResponse.json).toHaveBeenCalledWith(
      { success: false, error: 'Cookie operation failed' },
      { status: 500 }
    );
  });

  test('should call logoutUser business logic', async () => {
    jest.resetModules();

    // Re-mock the module after reset to ensure it's fresh
    jest.doMock('@/features/auth/api/logout', () => ({
      logoutUser: mockLogoutUser,
    }));
    const { POST: freshPOST } = require('@/app/api/auth/logout/route');

    mockLogoutUser.mockClear();

    await freshPOST();

    expect(mockLogoutUser).toHaveBeenCalled();
  });
});
