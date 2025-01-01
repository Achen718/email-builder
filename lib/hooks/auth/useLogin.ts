import { useFetch } from './useFetch';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks/hooks';
import {
  userLoginSuccess,
  userLoginFailed,
} from '@/lib/features/auth/authActions';

interface LoginResponse {
  token: string;
  user: {
    email: string;
    // Add other user properties as needed
  };
}

interface LoginRequestBody {
  email: string;
  password: string;
}

export const useLogin = () => {
  const { fetchData, loading, error, data } = useFetch<
    LoginResponse,
    LoginRequestBody
  >();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    await fetchData('/api/mockAuth/login', {
      method: 'POST',
      body: { email, password },
    });

    if (data) {
      localStorage.setItem('token', data.token);
      dispatch(userLoginSuccess(data.user));
      router.push('/dashboard');
    } else if (error) {
      dispatch(userLoginFailed(error));
    }
  };

  return { login, loading, error };
};
