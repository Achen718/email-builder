'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/hooks';
import { userLoginRequest } from '@/lib/features/auth/authActions';
import { loginFormFields } from '@/config/forms/formFieldsConfig';
import { selectAuthLoadingAndCurrentUser } from '@/lib/features/auth/authSelectors';
import Form from '@/components/forms/Form';

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, currentUser } = useAppSelector(
    selectAuthLoadingAndCurrentUser
  );

  const initialValues = {
    email: '',
    password: '',
  };

  const handleSubmit = (formData: { [key: string]: string }) => {
    dispatch(userLoginRequest(formData.email, formData.password));
  };

  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [router, currentUser]);

  return (
    <Form
      title='Sign in to your account'
      fields={loginFormFields}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      buttonText='Login'
      loading={loading}
    >
      <Link
        as={NextLink}
        href='/forgot-password'
        color={'blue.400'}
        fontSize={'sm'}
      >
        Forgot password?
      </Link>
    </Form>
  );
};

export default LoginForm;
