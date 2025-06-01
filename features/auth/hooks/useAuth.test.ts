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

  const mockLoginMutation = jest.fn().mockReturnValue({ unwrap: mockUnwrap });
  const mockSignUpMutation = jest.fn().mockReturnValue({ unwrap: mockUnwrap });
  const mockGoogleLoginMutation = jest
    .fn()
    .mockReturnValue({ unwrap: mockUnwrap });
  const mockLogoutMutation = jest.fn().mockReturnValue({ unwrap: mockUnwrap });

  beforeEach(() => {
    jest.clearAllMocks();

    (useAppSelector as unknown as jest.Mock).mockReturnValue({
      currentUser: { uid: 'test-uid', email: 'test@example.com' },
      userToken: 'test-token',
      authLoading: false,
    });
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useNotification as jest.Mock).mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: mockShowError,
    });

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
    const mockAuthResult = {
      user: { uid: 'user-123', email: 'user@example.com' },
      userToken: 'token-123',
      success: true,
    };
    mockUnwrap.mockResolvedValueOnce(mockAuthResult);
    const { result } = renderHook(() => useAuth());

    let success;
    await act(async () => {
      success = await result.current.login({
        email: 'user@example.com',
        password: 'password123',
      });
    });

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
    const error = new Error('Invalid credentials');
    mockUnwrap.mockRejectedValueOnce(error);
    const { result } = renderHook(() => useAuth());

    let success;
    await act(async () => {
      success = await result.current.login({
        email: 'user@example.com',
        password: 'wrong-password',
      });
    });

    expect(mockShowError).toHaveBeenCalledWith('Login failed', error);
    expect(mockPush).not.toHaveBeenCalled();
    expect(success).toBe(false);
  });
  test('signup should handle successful account creation', async () => {
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

    let success;
    await act(async () => {
      success = await result.current.signUp({
        displayName: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      });
    });

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

    let success;
    await act(async () => {
      success = await result.current.signInWithGoogle();
    });

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
    mockUnwrap.mockResolvedValueOnce({});

    const { result } = renderHook(() => useAuth());

    let success;
    await act(async () => {
      success = await result.current.logout();
    });

    expect(auth.signOut).toHaveBeenCalled();
    expect(localStorageMock.removeItem).toHaveBeenCalledTimes(2);
    expect(mockLogoutMutation).toHaveBeenCalledWith({});
    expect(mockDispatch).toHaveBeenCalledWith(clearCredentials());
    expect(mockShowSuccess).toHaveBeenCalledWith('Logged out successfully');
    expect(mockPush).toHaveBeenCalledWith('/');
    expect(success).toBe(true);
  });
  test('logout should handle failure', async () => {
    const error = new Error('Network error');
    mockUnwrap.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuth());

    let success;
    await act(async () => {
      success = await result.current.logout();
    });

    expect(mockShowError).toHaveBeenCalledWith('Logout failed', error);
    expect(success).toBe(false);
  });
  test('should use default redirect path when no redirect query param', async () => {
    Object.defineProperty(window, 'location', {
      value: { search: '' },
      writable: true,
    });

    mockUnwrap.mockResolvedValueOnce({
      user: { uid: 'user-123', email: 'user@example.com' },
      userToken: 'token-123',
      success: true,
    });
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        email: 'user@example.com',
        password: 'password123',
      });
    });

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
});
