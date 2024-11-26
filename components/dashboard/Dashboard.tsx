'use client';
import { Flex, Box, useColorModeValue } from '@chakra-ui/react';
import Sidebar from './side-bar/Sidebar';

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex minH='100vh' bg={useColorModeValue('gray.100', 'gray.900')}>
      <Sidebar />
      <Flex
        ml={{ base: 0, md: 60 }}
        flexDirection='column'
        flexBasis='0'
        flexGrow='1'
        flexShrink='1'
      >
        {children}
      </Flex>
    </Flex>
  );
};

export default Dashboard;
