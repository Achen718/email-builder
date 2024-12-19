'use client';

import { Box, HStack, Stack, Link } from '@chakra-ui/react';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/hooks';
import { userSignUpRequest } from '@/lib/features/auth/authActions';
import {
  selectAuthLoading,
  selectAuthSuccess,
} from '@/lib/features/auth/authSelectors';
import FormInput from '@/components/forms/formInput/FormInput';
import FormContainer from '@/components/forms/formContainer/FormContainer';
import FormButton from '@/components/forms/formButton/FormButton';

const defaultFormFields = {
  firstName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { firstName, email, password, confirmPassword } = formFields;

  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const success = useAppSelector(selectAuthSuccess);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      dispatch(userSignUpRequest({ firstName, email, password }));
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  useEffect(() => {
    if (success) {
      router.push('/dashboard');
    }
  }, [loading]);

  return (
    <FormContainer title='Sign up'>
      <form onSubmit={handleSubmit}>
        <HStack>
          <Box>
            <FormInput
              id='firstName'
              label='First Name'
              type='text'
              name='firstName'
              value={firstName}
              onChange={handleChange}
              isRequired
            />
          </Box>
          <Box>
            <FormInput
              id='lastName'
              label='Last Name'
              type='text'
              onChange={handleChange}
            />
          </Box>
        </HStack>
        <FormInput
          id='email'
          label='Email address'
          type='email'
          name='email'
          value={email}
          onChange={handleChange}
          isRequired
        />
        <FormInput
          id='password'
          label='Password'
          type='password'
          name='password'
          value={password}
          onChange={handleChange}
          isRequired
        />
        <FormInput
          id='confirmPassword'
          label='Confirm Password'
          type='password'
          name='confirmPassword'
          value={confirmPassword}
          onChange={handleChange}
          isRequired
        />
        <Stack spacing={10} pt={2}>
          <FormButton buttonText='Sign up' loading={loading} type='submit' />
        </Stack>
        <Box mt={2}>
          Already have an account?{' '}
          <Link as={NextLink} href='/login' color={'blue.400'}>
            Login
          </Link>
        </Box>
      </form>
    </FormContainer>
  );
};

export default SignUpForm;
