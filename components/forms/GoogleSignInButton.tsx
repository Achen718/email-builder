'use client';

import { Button, Icon, Text } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@/hooks/useAuth';

const GoogleSignInButton = () => {
  const { signInWithGoogle, isGoogleLoading } = useAuth();

  return (
    <Button
      w='100%'
      h='45px'
      mb={4}
      variant='outline'
      leftIcon={<Icon as={FcGoogle} boxSize='20px' />}
      onClick={signInWithGoogle}
      isLoading={isGoogleLoading}
      loadingText='Signing in'
      _hover={{ bg: 'gray.50' }}
    >
      <Text>Continue with Google</Text>
    </Button>
  );
};

export default GoogleSignInButton;
