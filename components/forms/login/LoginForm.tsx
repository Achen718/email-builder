'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Stack, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import FormContainer from '@/components/forms/formContainer/FormContainer';
import FormInput from '@/components/forms/formInput/FormInput';
import FormButton from '@/components/forms/formButton/FormButton';
import GoogleSignInButton from '@/components/forms/GoogleSignInButton';

const defaultFormFields = {
  email: '',
  password: '',
};

const LoginForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;
  const { login, isLoginLoading } = useAuth(); // Use your custom hook for auth

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <FormContainer title='Sign in to your account'>
      <form onSubmit={handleSubmit}>
        <FormInput
          id='email'
          label='Email address'
          type='email'
          name='email'
          value={formFields.email}
          onChange={handleChange}
          isRequired
        />
        <FormInput
          id='password'
          label='Password'
          type='password'
          name='password'
          value={formFields.password}
          onChange={handleChange}
          isRequired
        />
        <Stack pt={2}>
          <FormButton
            buttonText='Login'
            loading={isLoginLoading}
            type='submit'
          />
          <GoogleSignInButton />
        </Stack>
        <Box mt={2}>
          <Link as={NextLink} href='/' color={'blue.400'} fontSize={'sm'}>
            Forgot password?
          </Link>
        </Box>
      </form>
    </FormContainer>
  );
};

export default LoginForm;
