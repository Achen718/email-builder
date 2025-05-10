import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { auth } from '@/lib/firebase/client-app';
import { setCredentials, clearCredentials } from '@/features/auth/auth-slice';

import { useAppSelector, useAppDispatch } from '@/lib/hooks/hooks';
import { useNotification } from '../../../hooks/useNotification';
import { useRouter } from 'next/navigation';
import {
  useSignUpWithEmailMutation,
  useLoginWithEmailMutation,
  useGoogleLoginMutation,
  useLogoutUserMutation,
} from '@/features/auth/auth-api';

// Mock all dependencies
jest.mock('@/lib/firebase/client-app', () => ({
  auth: {
    signOut: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('@/features/auth/auth-api', () => ({
  useSignUpWithEmailMutation: jest.fn(),
  useLoginWithEmailMutation: jest.fn(),
  useGoogleLoginMutation: jest.fn(),
  useLogoutUserMutation: jest.fn(),
}));

jest.mock('@/lib/hooks/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

jest.mock('@/hooks/useNotification', () => ({
  useNotification: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useAuth hook', () => {
  const mockDispatch = jest.fn();
  const mockPush = jest.fn();
  const mockShowSuccess = jest.fn();
  const mockShowError = jest.fn();
  const mockUnwrap = jest.fn();

  // Setup mock returns for the API hooks
  const mockLoginMutation = jest.fn().mockReturnValue({ unwrap: mockUnwrap });
  const mockSignUpMutation = jest.fn().mockReturnValue({ unwrap: mockUnwrap });
  const mockGoogleLoginMutation = jest
    .fn()
    .mockReturnValue({ unwrap: mockUnwrap });
  const mockLogoutMutation = jest.fn().mockReturnValue({ unwrap: mockUnwrap });

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Redux state
    (useAppSelector as unknown as jest.Mock).mockReturnValue({
      currentUser: { uid: 'test-uid', email: 'test@example.com' },
      userToken: 'test-token',
      authLoading: false,
    });

    // Mock dispatch
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    // Mock router
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mock notifications
    (useNotification as jest.Mock).mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: mockShowError,
    });

    // Mock API hooks
    (useLoginWithEmailMutation as jest.Mock).mockReturnValue([
      mockLoginMutation,
      { isLoading: false },
    ]);

    (useSignUpWithEmailMutation as jest.Mock).mockReturnValue([
      mockSignUpMutation,
      { isLoading: false },
    ]);

    (useGoogleLoginMutation as jest.Mock).mockReturnValue([
      mockGoogleLoginMutation,
      { isLoading: false },
    ]);

    (useLogoutUserMutation as jest.Mock).mockReturnValue([
      mockLogoutMutation,
      { isLoading: false },
    ]);

    // Setup URL for testing redirect
    Object.defineProperty(window, 'location', {
      value: {
        search: '?redirect=/settings',
      },
      writable: true,
    });
  });

  test('should initialize hook correctly', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current).toHaveProperty('currentUser');
    expect(result.current).toHaveProperty('userToken');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('signUp');
    expect(result.current).toHaveProperty('logout');
    expect(result.current).toHaveProperty('signInWithGoogle');
  });

  test('login should handle successful authentication', async () => {
    // Setup successful login response
    const mockAuthResult = {
      user: { uid: 'user-123', email: 'user@example.com' },
      userToken: 'token-123',
      success: true,
    };
    mockUnwrap.mockResolvedValueOnce(mockAuthResult);

    const { result } = renderHook(() => useAuth());

    // Call login
    let success;
    await act(async () => {
      success = await result.current.login({
        email: 'user@example.com',
        password: 'password123',
      });
    });

    // Verify login functionality
    expect(mockLoginMutation).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      setCredentials({
        user: mockAuthResult.user,
        token: mockAuthResult.userToken,
      })
    );
    expect(mockShowSuccess).toHaveBeenCalledWith('Logged in successfully');
    expect(mockPush).toHaveBeenCalledWith('/settings');
    expect(success).toBe(true);
  });

  test('login should handle failed authentication', async () => {
    // Setup login failure
    const error = new Error('Invalid credentials');
    mockUnwrap.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuth());

    // Call login
    let success;
    await act(async () => {
      success = await result.current.login({
        email: 'user@example.com',
        password: 'wrong-password',
      });
    });

    // Verify error handling
    expect(mockShowError).toHaveBeenCalledWith('Login failed', error);
    expect(mockPush).not.toHaveBeenCalled();
    expect(success).toBe(false);
  });

  test('signup should handle successful account creation', async () => {
    // Setup successful signup response
    const mockAuthResult = {
      user: {
        uid: 'new-user-123',
        email: 'newuser@example.com',
        displayName: 'New User',
      },
      userToken: 'new-token-123',
      success: true,
    };
    mockUnwrap.mockResolvedValueOnce(mockAuthResult);

    const { result } = renderHook(() => useAuth());

    // Call signup
    let success;
    await act(async () => {
      success = await result.current.signUp({
        displayName: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      });
    });

    // Verify signup functionality
    expect(mockSignUpMutation).toHaveBeenCalledWith({
      displayName: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      setCredentials({
        user: mockAuthResult.user,
        token: mockAuthResult.userToken,
      })
    );
    expect(mockShowSuccess).toHaveBeenCalledWith(
      'Account created successfully'
    );
    expect(mockPush).toHaveBeenCalledWith('/settings');
    expect(success).toBe(true);
  });

  test('signInWithGoogle should handle successful authentication', async () => {
    // Setup successful Google login response
    const mockAuthResult = {
      user: {
        uid: 'google-user-123',
        email: 'google@example.com',
        displayName: 'Google User',
      },
      userToken: 'google-token-123',
      success: true,
    };
    mockUnwrap.mockResolvedValueOnce(mockAuthResult);

    const { result } = renderHook(() => useAuth());

    // Call Google login
    let success;
    await act(async () => {
      success = await result.current.signInWithGoogle();
    });

    // Verify Google login functionality
    expect(mockGoogleLoginMutation).toHaveBeenCalledWith({});
    expect(mockDispatch).toHaveBeenCalledWith(
      setCredentials({
        user: mockAuthResult.user,
        token: mockAuthResult.userToken,
      })
    );
    expect(mockShowSuccess).toHaveBeenCalledWith(
      'Signed in with Google successfully'
    );
    expect(mockPush).toHaveBeenCalledWith('/settings');
    expect(success).toBe(true);
  });

  test('logout should handle successful logout', async () => {
    // Setup successful logout
    mockUnwrap.mockResolvedValueOnce({});

    const { result } = renderHook(() => useAuth());

    // Call logout
    let success;
    await act(async () => {
      success = await result.current.logout();
    });

    // Verify logout functionality
    expect(auth.signOut).toHaveBeenCalled();
    expect(localStorageMock.removeItem).toHaveBeenCalledTimes(2);
    expect(mockLogoutMutation).toHaveBeenCalledWith({});
    expect(mockDispatch).toHaveBeenCalledWith(clearCredentials());
    expect(mockShowSuccess).toHaveBeenCalledWith('Logged out successfully');
    expect(mockPush).toHaveBeenCalledWith('/');
    expect(success).toBe(true);
  });

  test('logout should handle failure', async () => {
    // Setup logout failure
    const error = new Error('Network error');
    mockUnwrap.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuth());

    // Call logout
    let success;
    await act(async () => {
      success = await result.current.logout();
    });

    // Verify error handling
    expect(mockShowError).toHaveBeenCalledWith('Logout failed', error);
    expect(success).toBe(false);
  });

  test('should use default redirect path when no redirect query param', async () => {
    // Reset window.location.search
    Object.defineProperty(window, 'location', {
      value: { search: '' },
      writable: true,
    });

    // Setup successful login response
    mockUnwrap.mockResolvedValueOnce({
      user: { uid: 'user-123', email: 'user@example.com' },
      userToken: 'token-123',
      success: true,
    });

    const { result } = renderHook(() => useAuth());

    // Call login
    await act(async () => {
      await result.current.login({
        email: 'user@example.com',
        password: 'password123',
      });
    });

    // Verify default redirect path was used
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
});
