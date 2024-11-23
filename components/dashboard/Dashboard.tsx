'use client';
import { Box, useColorModeValue } from '@chakra-ui/react';
import Sidebar from './side-bar/Sidebar';

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box minH='100vh' bg={useColorModeValue('gray.100', 'gray.900')}>
      <Sidebar />
      <Box ml={{ base: 0, md: 60 }} p='4'>
        {children}
      </Box>
    </Box>
  );
};

export default Dashboard;
