import { useAppDispatch } from '@/lib/hooks/hooks';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { setCredentials } from '@/lib/features/auth/authSlice';
import {
  useSignUpWithEmailMutation,
  useLoginWithEmailMutation,
} from '@/lib/services/api/firebaseApiSlice';
import { getErrorMessage } from '@/utils/getErrorMessage';

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
  const toast = useToast();
  const router = useRouter();

  const [loginWithEmail, { isLoading: isLoginLoading }] =
    useLoginWithEmailMutation();
  const [signUpWithEmail, { isLoading: isSignUpLoading }] =
    useSignUpWithEmailMutation();

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

      toast({
        title: successTitle,
        status: 'success',
        duration: 3000,
      });
      const searchParams = new URLSearchParams(window.location.search);
      const redirectPath = searchParams.get('redirect') || '/dashboard';
      router.push(redirectPath);

      return true;
    } catch (error) {
      toast({
        title: errorTitle,
        description: getErrorMessage(error),
        status: 'error',
        duration: 5000,
      });
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

  return {
    signUp,
    login,
    isSignUpLoading,
    isLoginLoading,
  };
};
