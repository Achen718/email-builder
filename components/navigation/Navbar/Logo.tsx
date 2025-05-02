'use client';
import Link from 'next/link';
import { Box, Flex, Text, HStack, useColorModeValue } from '@chakra-ui/react';

const NavLogo = () => {
  const textColor = useColorModeValue('gray.800', 'white');
  const buttonBgColor = useColorModeValue('purple.500', 'purple.400');

  return (
    <Flex align='center'>
      <Link href='/'>
        <HStack spacing={2} data-testid='navbar-logo'>
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
  );
};

export default NavLogo;
