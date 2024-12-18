import { Box, Flex, Heading, Stack, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface FormContainerProps {
  title: string;
  children: ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ title, children }) => {
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
            {title}
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>{children}</Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default FormContainer;
