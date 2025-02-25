'use client';
import { Flex, useColorModeValue } from '@chakra-ui/react';

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex minH='100vh' bg={useColorModeValue('gray.100', 'gray.900')}>
      <Flex flexDirection='column' flexBasis='0' flexGrow='1' flexShrink='1'>
        {children}
      </Flex>
    </Flex>
  );
};

export default Dashboard;
