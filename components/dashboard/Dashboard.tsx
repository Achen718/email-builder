'use client';
import { Box, useColorModeValue } from '@chakra-ui/react';
import Sidebar from './side-bar/Sidebar';
import DashboardContent from './content/DashboardContent';

const Dashboard = () => {
  return (
    <Box minH='100vh' bg={useColorModeValue('gray.100', 'gray.900')}>
      <Sidebar />
      <Box ml={{ base: 0, md: 60 }} p='4'>
        <DashboardContent />
      </Box>
    </Box>
  );
};

export default Dashboard;
