import { renderHook, act } from '@testing-library/react';
import { useAuthStateSync } from './useAuthStateSync';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useCreateSessionMutation } from '@/features/auth/auth-api';
import { useAppDispatch } from '@/lib/hooks/hooks';
import {
  setCredentials,
  clearCredentials,
  setAuthLoading,
} from '@/features/auth/auth-slice';

type AuthStateChangeCallback = (user: User | null) => Promise<void>;

// Mock dependencies
jest.mock('@/lib/firebase/client-app', () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
  },
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

jest.mock('@/features/auth/auth-api', () => ({
  useCreateSessionMutation: jest.fn(),
}));

jest.mock('@/lib/hooks/hooks', () => ({
  useAppDispatch: jest.fn(),
}));

describe('useAuthStateSync', () => {
  // Common test variables
  const mockDispatch = jest.fn();
  const mockUnwrap = jest.fn();
  const mockCreateSession = jest.fn().mockReturnValue({ unwrap: mockUnwrap });
  const mockUnsubscribe = jest.fn();
  let authChangeCallback: AuthStateChangeCallback;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mocks
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useCreateSessionMutation as jest.Mock).mockReturnValue([
      mockCreateSession,
    ]);

    // Mock onAuthStateChanged to capture the callback
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      authChangeCallback = callback;
      return mockUnsubscribe;
    });
  });

  test('should set auth loading on initial render', () => {
    renderHook(() => useAuthStateSync());

    expect(mockDispatch).toHaveBeenCalledWith(setAuthLoading(true));
  });

  test('should set credentials when user is authenticated', async () => {
    // Prepare mock user
    const mockUser: Partial<User> = {
      uid: 'user-123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/photo.jpg',
      getIdToken: jest.fn().mockResolvedValue('mock-id-token'),
    };

    // Mock successful session creation
    mockUnwrap.mockResolvedValue({ success: true });

    // Render hook
    renderHook(() => useAuthStateSync());

    // Simulate auth state change with authenticated user
    await act(async () => {
      await authChangeCallback(mockUser as User);
    });

    // Verify behavior
    expect(mockUser.getIdToken).toHaveBeenCalled();
    expect(mockCreateSession).toHaveBeenCalledWith({
      idToken: 'mock-id-token',
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      setCredentials({
        user: {
          uid: 'user-123',
          email: 'test@example.com',
          displayName: 'Test User',
          photoURL: 'https://example.com/photo.jpg',
        },
        token: 'mock-id-token',
      })
    );
  });

  test('should clear credentials when user is signed out', async () => {
    // Render hook
    renderHook(() => useAuthStateSync());

    // Simulate auth state change with null (signed out)
    await act(async () => {
      await authChangeCallback(null);
    });

    // Verify credentials were cleared
    expect(mockDispatch).toHaveBeenCalledWith(clearCredentials());
  });

  test('should clear credentials when session verification fails', async () => {
    // Prepare mock user
    const mockUser: Partial<User> = {
      uid: 'user-123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/photo.jpg',
      getIdToken: jest.fn().mockResolvedValue('mock-id-token'),
    };
    // Mock failed session creation
    const error = new Error('Session verification failed');
    mockUnwrap.mockRejectedValue(error);

    // Mock console.error
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // Render hook
    renderHook(() => useAuthStateSync());

    // Simulate auth state change with authenticated user
    await act(async () => {
      await authChangeCallback(mockUser as User);
    });

    // Verify behavior
    expect(console.error).toHaveBeenCalledWith(
      'Session verification failed',
      error
    );
    expect(mockDispatch).toHaveBeenCalledWith(clearCredentials());

    // Restore console.error
    console.error = originalConsoleError;
  });

  test('should unsubscribe from auth state changes on unmount', () => {
    // Render hook
    const { unmount } = renderHook(() => useAuthStateSync());

    // Unmount the component
    unmount();

    // Verify unsubscribe was called
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
