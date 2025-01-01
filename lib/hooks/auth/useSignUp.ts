import { useFetch } from '../useFetch';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks/hooks';
import {
  userSignUpSuccess,
  userSignUpFailed,
} from '@/lib/features/auth/authActions';

interface SignUpResponse {
  token: string;
  user: {
    firstName: string;
    email: string;
    // Add other user properties as needed
  };
}

interface SignUpRequestBody {
  firstName: string;
  email: string;
  password: string;
}

export const useSignUp = () => {
  const { fetchData, loading, error, data } = useFetch<
    SignUpResponse,
    SignUpRequestBody
  >();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const signUp = async (firstName: string, email: string, password: string) => {
    await fetchData('/api/mockAuth/sign-up', {
      method: 'POST',
      body: { firstName, email, password },
    });

    if (data) {
      localStorage.setItem('token', data.token);
      dispatch(userSignUpSuccess(data.user));
      router.push('/dashboard');
    } else if (error) {
      dispatch(userSignUpFailed(error));
    }
  };

  return { signUp, loading, error };
};
