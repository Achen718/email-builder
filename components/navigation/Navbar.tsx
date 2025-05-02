'use client';
import Link from 'next/link';
import {
  useColorMode,
  Box,
  Flex,
  Text,
  Button,
  Stack,
  useColorModeValue,
  useDisclosure,
  IconButton,
  Container,
  HStack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';

// Define navigation links
const navItems = [
  { label: 'Products', href: '/products' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Enterprise', href: '/enterprise' },
  { label: 'Customers', href: '/customers' },
];

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode(); // Add this line
  const bg = useColorModeValue('white', '#0d0d0d');
  const textColor = useColorModeValue('gray.800', 'white');
  const buttonBgColor = useColorModeValue('purple.500', 'purple.400');
  const buttonHoverBg = useColorModeValue('purple.700', 'purple.300');
  const menuBorderColor = useColorModeValue('gray.100', 'gray.800');

  return (
    <Box
      role='navigation'
      position='sticky'
      top={0}
      zIndex={100}
      // bg={bg}
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={menuBorderColor}
    >
      <Container maxW='container.xl'>
        <Flex
          minH={'64px'}
          py={{ base: 2 }}
          align={'center'}
          justify='space-between'
        >
          {/* Logo and brand */}
          <Flex align='center'>
            <Link href='/'>
              <HStack spacing={2}>
                <Box
                  w='32px'
                  h='32px'
                  bg={buttonBgColor}
                  rounded='md'
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                >
                  <Text fontWeight='bold' color='white' fontSize='lg'>
                    E
                  </Text>
                </Box>
                <Text
                  fontWeight='semibold'
                  fontSize='xl'
                  color={textColor}
                  display={{ base: 'none', md: 'block' }}
                >
                  EmailBuilder
                </Text>
              </HStack>
            </Link>
          </Flex>

          {/* Desktop Navigation */}
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Text fontWeight='medium' color={textColor}>
                  {item.label}
                </Text>
              </Link>
            ))}
          </HStack>

          {/* Mobile Toggle Button */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />

          {/* Login/Signup Buttons - desktop only */}
          <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
            {/* Theme Toggle Button */}
            <IconButton
              aria-label='Toggle color mode'
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              size='md'
              variant='ghost'
              colorScheme='purple'
              _hover={{
                bg: useColorModeValue('gray.100', 'gray.700'),
              }}
            />

            <Link href='/login'>
              <Button variant='ghost' fontWeight='medium' size='md'>
                Log in
              </Button>
            </Link>
            <Link href='/sign-up'>
              <Button
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
        </Flex>

        {/* Mobile Navigation */}
        {isOpen && (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack spacing={4} pt={2}>
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Text px={4} py={1} fontWeight='medium' color={textColor}>
                    {item.label}
                  </Text>
                </Link>
              ))}

              {/* Theme Toggle - mobile */}
              <Flex px={4} py={1} align='center' justify='space-between'>
                <Text fontWeight='medium' color={textColor}>
                  {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
                </Text>
                <IconButton
                  aria-label='Toggle color mode'
                  icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                  onClick={toggleColorMode}
                  size='sm'
                  variant='ghost'
                />
              </Flex>

              {/* Login/Signup Buttons - mobile only */}
              <Box
                pt={2}
                pb={2}
                borderTopWidth={1}
                borderColor={menuBorderColor}
              >
                <Link href='/login'>
                  <Button
                    variant='ghost'
                    fontWeight='medium'
                    size='md'
                    mx={4}
                    my={2}
                    width='calc(100% - 32px)'
                  >
                    Log in
                  </Button>
                </Link>
                <Link href='/sign-up'>
                  <Button
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
        )}
      </Container>
    </Box>
  );
};

export default Navbar;
