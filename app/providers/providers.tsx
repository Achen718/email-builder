'use client';

import {
  ChakraProvider,
  extendTheme,
  cookieStorageManagerSSR,
  localStorageManager,
} from '@chakra-ui/react';

const config = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};

const theme = extendTheme({ config });

export function Providers({
  children,
  cookies,
}: {
  children: React.ReactNode;
  cookies: string;
}) {
  // Use cookieStorageManagerSSR for SSR + client rendering
  const colorModeManager =
    typeof cookies === 'string'
      ? cookieStorageManagerSSR(cookies)
      : localStorageManager;

  return (
    <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
      {children}
    </ChakraProvider>
  );
}
