'use client';

import {
  Stack,
  useColorModeValue,
  Heading,
  Text,
  Flex,
} from '@chakra-ui/react';

interface EmailEditorHeadingProps {
  templateTitle: string;
  displayName: string;
  children: React.ReactNode;
}

const EmailEditorHeading: React.FC<EmailEditorHeadingProps> = ({
  children,
  templateTitle,
  displayName,
}) => {
  return (
    <Flex
      w='100%'
      bg={useColorModeValue('white', 'whiteAlpha.100')}
      boxShadow={'xl'}
      p={6}
      justifyContent={'space-between'}
      borderBottom='1px'
      borderColor={'gray.200'}
    >
      <Stack direction={{ base: 'row' }} spacing={'12px'} align='baseline'>
        <Heading as={'h2'} fontSize={{ base: 'xl', sm: '2xl' }}>
          {templateTitle}
        </Heading>
        <Text>{displayName}</Text>
      </Stack>
      <Stack direction={{ base: 'row' }} spacing={'12px'}>
        {/* remove children and import btn group */}
        {children}
      </Stack>
    </Flex>
  );
};

export default EmailEditorHeading;
