'use client';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import Sidebar from '../side-bar/Sidebar';

const DashboardHeader = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { currentUser, logout, authLoading: isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <Box bg={useColorModeValue('white', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Sidebar />
          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >
                  {isLoading ? (
                    <Spinner size='sm' />
                  ) : (
                    <Avatar
                      name={currentUser?.displayName}
                      size={'sm'}
                      src={currentUser?.photoURL}
                    />
                  )}
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <br />
                  <Center>
                    {isLoading ? (
                      <Spinner size='sm' />
                    ) : (
                      <Avatar
                        name={currentUser?.displayName}
                        size={'md'}
                        src={currentUser?.photoURL}
                      />
                    )}
                  </Center>
                  <br />
                  <Center>
                    {/* replace with auth user */}
                    <Center>
                      {/* Update this to show the actual user */}
                      <p>
                        {currentUser?.displayName ||
                          currentUser?.email ||
                          'Guest'}
                      </p>
                    </Center>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem>Account Settings</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default DashboardHeader;
