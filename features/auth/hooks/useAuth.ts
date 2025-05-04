import { useAppDispatch } from '@/lib/hooks/hooks';
import { useRouter } from 'next/navigation';
import { setCredentials, clearCredentials } from '@/features/auth/auth-slice';
import {
  useSignUpWithEmailMutation,
  useLoginWithEmailMutation,
  useGoogleLoginMutation,
  useLogoutUserMutation,
} from '@/features/auth/auth-api';
import { useAppSelector } from '@/lib/hooks/hooks';
import { useNotification } from '../../../hooks/useNotification';

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface AuthResult {
  user: UserData;
  userToken: string;
  success: boolean;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { currentUser, userToken, authLoading } = useAppSelector(
    (state) => state.auth
  );

  const { showSuccess, showError } = useNotification();

  const [loginWithEmail, { isLoading: isLoginLoading }] =
    useLoginWithEmailMutation();
  const [signUpWithEmail, { isLoading: isSignUpLoading }] =
    useSignUpWithEmailMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] =
    useGoogleLoginMutation();
  const [logoutUser, { isLoading: isLogoutLoading }] = useLogoutUserMutation();

  const handleAuthentication = async <T>(
    authAction: Promise<T>,
    successTitle: string,
    errorTitle: string
  ) => {
    try {
      const result = await authAction;

      // Handle success
      const authResult = result as AuthResult;
      dispatch(
        setCredentials({
          user: authResult.user,
          token: authResult.userToken,
        })
      );

      showSuccess(successTitle);

      const searchParams = new URLSearchParams(window.location.search);
      const redirectPath = searchParams.get('redirect') || '/dashboard';
      router.push(redirectPath);

      return true;
    } catch (error) {
      showError(errorTitle, error);
      return false;
    }
  };

  const login = async (userData: { email: string; password: string }) => {
    return handleAuthentication(
      loginWithEmail(userData).unwrap(),
      'Logged in successfully',
      'Login failed'
    );
  };

  const signUp = async (userData: {
    firstName: string;
    email: string;
    password: string;
  }) => {
    return handleAuthentication(
      signUpWithEmail(userData).unwrap(),
      'Account created successfully',
      'Sign up failed'
    );
  };

  const signInWithGoogle = async () => {
    return handleAuthentication(
      googleLogin({}).unwrap(),
      'Signed in with Google successfully',
      'Google sign-in failed'
    );
  };

  const logout = async () => {
    try {
      await logoutUser({}).unwrap();
      dispatch(clearCredentials());
      showSuccess('Logged out successfully');
      router.push('/');
      return true;
    } catch (error) {
      showError('Logout failed', error);
      return false;
    }
  };

  return {
    currentUser,
    userToken,
    authLoading,
    signUp,
    login,
    logout,
    signInWithGoogle,
    isSignUpLoading,
    isLoginLoading,
    isGoogleLoading,
    isLogoutLoading,
  };
};
