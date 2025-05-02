'use client';
import Link from 'next/link';
import {
  Box,
  Text,
  Stack,
  Flex,
  Button,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import ThemeToggle from './ThemeToggle';

interface NavItem {
  label: string;
  href: string;
}

interface MobileNavProps {
  navItems: NavItem[];
}

const MobileNav = ({ navItems }: MobileNavProps) => {
  const { colorMode } = useColorMode();
  const textColor = useColorModeValue('gray.800', 'white');
  const menuBorderColor = useColorModeValue('gray.100', 'gray.800');
  const buttonBgColor = useColorModeValue('purple.500', 'purple.400');
  const buttonHoverBg = useColorModeValue('purple.700', 'purple.600');

  return (
    <Box pb={4} display={{ md: 'none' }} data-testid='mobile-menu'>
      <Stack spacing={4} pt={2}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Text
              px={4}
              py={1}
              fontWeight='medium'
              color={textColor}
              data-testid={`mobile-nav-item-${item.label.toLowerCase()}`}
            >
              {item.label}
            </Text>
          </Link>
        ))}

        {/* Theme Toggle - mobile */}
        <Flex px={4} py={1} align='center' justify='space-between'>
          <Text fontWeight='medium' color={textColor}>
            {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <ThemeToggle mobile={true} size='sm' />
        </Flex>

        {/* Login/Signup Buttons - mobile only */}
        <Box pt={2} pb={2} borderTopWidth={1} borderColor={menuBorderColor}>
          <Link href='/login'>
            <Button
              variant='ghost'
              fontWeight='medium'
              size='md'
              mx={4}
              my={2}
              width='calc(100% - 32px)'
              aria-label='login button'
              data-testid='mobile-login-button'
            >
              Login
            </Button>
          </Link>
          <Link href='/sign-up'>
            <Button
              aria-label='register button'
              data-testid='mobile-register-button'
              bg={buttonBgColor}
              color='white'
              fontWeight='medium'
              size='md'
              mx={4}
              my={2}
              width='calc(100% - 32px)'
              _hover={{ bg: buttonHoverBg }}
            >
              Get started
            </Button>
          </Link>
        </Box>
      </Stack>
    </Box>
  );
};

export default MobileNav;
