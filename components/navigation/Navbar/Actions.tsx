'use client';
import Link from 'next/link';
import { Button, HStack, useColorModeValue } from '@chakra-ui/react';
import ThemeToggle from './ThemeToggle';

const NavActions = () => {
  const buttonBgColor = useColorModeValue('purple.500', 'purple.400');
  const buttonHoverBg = useColorModeValue('purple.700', 'purple.600');

  return (
    <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
      <ThemeToggle />

      <Link href='/login'>
        <Button
          variant='ghost'
          fontWeight='medium'
          size='md'
          aria-label='login button'
          data-testid='login-button'
        >
          Login
        </Button>
      </Link>

      <Link href='/sign-up'>
        <Button
          aria-label='register button'
          data-testid='register-button'
          bg={buttonBgColor}
          color='white'
          fontWeight='medium'
          size='md'
          px={6}
          _hover={{ bg: buttonHoverBg }}
        >
          Get started
        </Button>
      </Link>
    </HStack>
  );
};

export default NavActions;
