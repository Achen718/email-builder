'use client';

import { Box, HStack, Stack, Link, useToast } from '@chakra-ui/react';
import { useState, ChangeEvent, FormEvent } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import FormInput from '@/components/forms/formInput/FormInput';
import FormContainer from '@/components/forms/formContainer/FormContainer';
import FormButton from '@/components/forms/formButton/FormButton';
import GoogleSignInButton from '../GoogleSignInButton';

const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;

  const router = useRouter();
  const toast = useToast();

  const { signUp, isSignUpLoading } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    signUp({
      displayName,
      email,
      password,
    });
  };

  return (
    <FormContainer title='Sign up'>
      <form onSubmit={handleSubmit}>
        <HStack>
          <Box>
            <FormInput
              id='displayName'
              label='First Name'
              type='text'
              name='displayName'
              value={displayName}
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
        <Stack pt={2}>
          <FormButton
            buttonText='Sign up'
            loading={isSignUpLoading}
            type='submit'
          />
          <GoogleSignInButton />
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
