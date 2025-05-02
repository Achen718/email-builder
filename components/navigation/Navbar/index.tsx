'use client';
import { createContext, useContext } from 'react';
import {
  Box,
  Container,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';

// Import your existing components
import NavLogo from './Logo';
import DesktopNav from './Desktop';
import MobileNav from './Mobile';
import NavActions from './Actions';
import ThemeToggle from './ThemeToggle';
import MobileToggle from './MobileToggle';

// Create the context
export const NavbarContext = createContext<{
  isOpen: boolean;
  onToggle: () => void;
} | null>(null);

// Main Navbar object with nested components
const Navbar = {
  // Root container - handles state and styling
  Root: ({ children }: { children: React.ReactNode }) => {
    const { isOpen, onToggle } = useDisclosure();
    const bg = useColorModeValue('white', 'gray.800');
    const menuBorderColor = useColorModeValue('gray.100', 'gray.800');

    return (
      <NavbarContext.Provider value={{ isOpen, onToggle }}>
        <Box
          as='nav'
          position='sticky'
          top={0}
          zIndex={100}
          bg={bg}
          borderBottom={1}
          borderStyle={'solid'}
          borderColor={menuBorderColor}
        >
          <Container maxW='container.xl'>{children}</Container>
        </Box>
      </NavbarContext.Provider>
    );
  },

  // Logo component
  Logo: NavLogo,

  // Desktop navigation content
  Desktop: DesktopNav,

  // Mobile menu toggle button
  MobileToggle,

  // Action buttons (login/signup)
  Actions: NavActions,

  // Theme toggle button
  ThemeToggle,

  // Mobile menu
  Mobile: ({
    navItems,
  }: {
    navItems: Array<{ label: string; href: string }>;
  }) => {
    const context = useContext(NavbarContext);
    if (!context) return null;
    const { isOpen } = context;

    if (!isOpen) return null;
    return <MobileNav navItems={navItems} />;
  },
};

export default Navbar;
