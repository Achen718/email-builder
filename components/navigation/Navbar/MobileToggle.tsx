'use client';
import { useContext } from 'react';
import { IconButton } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { NavbarContext } from './index';

const MobileToggle = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('MobileToggle must be used within Navbar.Root');
  }

  const { isOpen, onToggle } = context;

  return (
    <IconButton
      display={{ base: 'flex', md: 'none' }}
      onClick={onToggle}
      icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
      variant={'ghost'}
      aria-label={'Toggle Navigation'}
      data-testid='mobile-toggle'
    />
  );
};

export default MobileToggle;
