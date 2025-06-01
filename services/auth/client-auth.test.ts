import { auth } from '@/lib/firebase/client-app';
import { signInWithPopup, User } from 'firebase/auth';
import { processUserAuthentication } from './client-auth';

jest.mock('./client-auth', () => {
  const originalModule = jest.requireActual('./client-auth');
  return {
    ...originalModule,
    signInWithGooglePopup: jest.fn().mockResolvedValue({
      user: {
        email: 'test@example.com',
        displayName: 'Test User',
        uid: 'test-uid-123',
        getIdToken: jest.fn().mockResolvedValue('mock-id-token'),
      },
    }),
    // Keep the real googleSignIn since that's what you're testing
    googleSignIn: originalModule.googleSignIn,
  };
});

const { signInWithGooglePopup, googleSignIn } =
  jest.requireActual('./client-auth');

jest.mock('@/lib/firebase/client-app', () => ({
  auth: {
    currentUser: null,
    signInWithPopup: jest.fn(),
  },
}));

jest.mock('firebase/auth', () => {
  const mockUser = {
    email: 'test@example.com',
    displayName: 'Test User',
    uid: 'test-uid-123',
    getIdToken: jest.fn().mockResolvedValue('mock-id-token'),
  };

  return {
    signInWithPopup: jest.fn().mockResolvedValue({ user: mockUser }),
    GoogleAuthProvider: jest.fn().mockImplementation(() => ({
      providerId: 'google.com',
    })),
    User: jest.fn(),
  };
});

const mockFetchResponse = {
  json: jest.fn(),
};
global.fetch = jest.fn().mockResolvedValue(mockFetchResponse);

describe('Authentication Service', () => {
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchResponse.json.mockResolvedValue({ success: true });
  });

  describe('signInWithGooglePopup', () => {
    test('should call Firebase signInWithPopup with Google provider', async () => {
      await signInWithGooglePopup();

      expect(signInWithPopup).toHaveBeenCalledTimes(1);
      expect(signInWithPopup).toHaveBeenCalledWith(
        auth,
        expect.objectContaining({
          providerId: 'google.com',
        })
      );
    });
  });

  describe('processUserAuthentication', () => {
    const mockUser: Partial<User> = {
      email: 'test@example.com',
      displayName: 'Test User',
      uid: 'test-uid-123',
      getIdToken: jest.fn().mockResolvedValue('mock-id-token'),
    };
    test('should process user authentication successfully', async () => {
      const result = await processUserAuthentication(mockUser as User);
      expect(mockUser.getIdToken).toHaveBeenCalledTimes(1);

      expect(fetch).toHaveBeenCalledWith('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: 'mock-id-token' }),
      });

      expect(result).toEqual({
        user: {
          email: 'test@example.com',
          displayName: 'Test User',
          uid: 'test-uid-123',
        },
        userToken: 'mock-id-token',
      });
    });
    test('should throw error when API returns error', async () => {
      mockFetchResponse.json.mockResolvedValueOnce({
        success: false,
        error: 'User creation failed',
      });

      await expect(processUserAuthentication(mockUser as User)).rejects.toThrow(
        'User creation failed'
      );

      expect(mockUser.getIdToken).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('should throw error when fetch fails', async () => {
      const fetchError = new Error('Network error');
      (global.fetch as jest.Mock).mockRejectedValueOnce(fetchError);

      await expect(processUserAuthentication(mockUser as User)).rejects.toThrow(
        'Network error'
      );

      expect(mockUser.getIdToken).toHaveBeenCalledTimes(1);
    });
  });

  describe('googleSignIn', () => {
    test('should sign in with Google and return user data', async () => {
      const result = await googleSignIn();

      expect(signInWithPopup).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        user: {
          email: 'test@example.com',
          displayName: 'Test User',
          uid: 'test-uid-123',
        },
        userToken: 'mock-id-token',
      });
    });

    test('should throw error when Google sign-in fails', async () => {
      const signInError = new Error('Google authentication failed');
      (signInWithPopup as jest.Mock).mockRejectedValueOnce(signInError);

      await expect(googleSignIn()).rejects.toThrow(
        'Google authentication failed'
      );
    });
  });
});
