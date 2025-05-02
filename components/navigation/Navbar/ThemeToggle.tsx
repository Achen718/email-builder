'use client';
import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

interface ThemeToggleProps {
  size?: string;
  variant?: string;
  mobile?: boolean;
}

const ThemeToggle = ({
  size = 'md',
  variant = 'ghost',
  mobile = false,
}: ThemeToggleProps) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label='Toggle color mode'
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      onClick={toggleColorMode}
      size={size}
      variant={variant}
      colorScheme='purple'
      _hover={{
        bg: useColorModeValue('gray.100', 'gray.700'),
      }}
      data-testid={mobile ? 'mobile-theme-toggle' : 'theme-toggle'}
    />
  );
};

export default ThemeToggle;
