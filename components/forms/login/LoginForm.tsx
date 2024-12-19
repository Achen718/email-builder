'use client';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Stack, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/hooks';
import { userLoginRequest } from '@/lib/features/auth/authActions';
import { selectAuthLoadingAndCurrentUser } from '@/lib/features/auth/authSelectors';
import FormContainer from '@/components/forms/formContainer/FormContainer';
import FormInput from '@/components/forms/formInput/FormInput';
import FormButton from '@/components/forms/formButton/FormButton';

const defaultFormFields = {
  email: '',
  password: '',
};

const LoginForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, currentUser } = useAppSelector(
    selectAuthLoadingAndCurrentUser
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(userLoginRequest(email, password));
  };

  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [router, currentUser]);

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
        <Stack spacing={10} pt={2}>
          <FormButton buttonText='Login' loading={loading} type='submit' />
        </Stack>
        <Box mt={2}>
          <Link
            as={NextLink}
            href='/forgot-password'
            color={'blue.400'}
            fontSize={'sm'}
          >
            Forgot password?
          </Link>
        </Box>
      </form>
    </FormContainer>
  );
};

export default LoginForm;
