'use client';

import {
  Flex,
  Box,
  HStack,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import FormInput from '@/components/forms/formInput/FormInput';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/hooks';
import { userSignUp } from '@/lib/features/auth/authActions';

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
  const { loading, error, success } = useAppSelector((state) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    dispatch(userSignUp({ firstName, email, password }));
  };

  useEffect(() => {
    if (success) router.push('/login');
  }, [router, success]);

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
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
                <Button
                  isLoading={loading}
                  loadingText='Submitting'
                  type='submit'
                  size='lg'
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Already a user?{' '}
                  <Link as={NextLink} href='/login' color={'blue.400'}>
                    Login
                  </Link>
                </Text>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignUpForm;
