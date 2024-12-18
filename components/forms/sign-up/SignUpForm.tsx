'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/hooks';
import { userSignUpRequest } from '@/lib/features/auth/authActions';
import {
  selectAuthLoading,
  selectAuthSuccess,
} from '@/lib/features/auth/authSelectors';
import { signUpFormFields } from '@/config/forms/formFieldsConfig';
import Form from '@/components/forms/Form';

const SignUpForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const success = useAppSelector(selectAuthSuccess);

  const initialValues = {
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const handleSubmit = (formData: { [key: string]: string }) => {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    dispatch(userSignUpRequest(formData));
  };

  useEffect(() => {
    if (success) {
      router.push('/dashboard');
    }
  }, [success, router]);

  return (
    <Form
      title='Sign up'
      fields={signUpFormFields}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      buttonText='Sign up'
      loading={loading}
    >
      Already have an account?{' '}
      <Link as={NextLink} href='/login' color={'blue.400'}>
        Login
      </Link>
    </Form>
  );
};

export default SignUpForm;
