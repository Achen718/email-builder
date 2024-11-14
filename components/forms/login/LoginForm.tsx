import {
  Flex,
  Box,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks/hooks';
import { setAuthToken } from '@/lib/features/auth/authSlice';
import { userLogin } from '@/services/auth/authService';
import FormInput from '@/components/forms/formInput/FormInput';

const defaultFormFields = {
  email: '',
  password: '',
};

const LoginForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [rememberMe, setRememberMe] = useState(false);
  const { email, password } = formFields;

  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await userLogin(email, password);

    dispatch(setAuthToken({ userToken: response.token }));
    router.push('/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <form onSubmit={handleLogin}>
              <FormInput
                id='email'
                label='Email address'
                name='email'
                type='email'
                value={email}
                onChange={handleChange}
              />
              <FormInput
                id='password'
                label='Password'
                name='password'
                type='password'
                value={password}
                onChange={handleChange}
              />
              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}
                >
                  <Checkbox
                    isChecked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  >
                    Remember me
                  </Checkbox>
                  <Text color={'blue.400'}>Forgot password?</Text>
                </Stack>
                <Button
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  type='submit'
                  name='login'
                >
                  Login
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginForm;
