import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Providers } from './providers/providers';
import StoreProvider from './providers/StoreProvider';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Access cookies
  const cookieStore = cookies();

  return (
    <StoreProvider>
      <html lang='en'>
        <body>
          <Providers cookies={cookieStore.toString()}>{children}</Providers>
        </body>
      </html>
    </StoreProvider>
  );
}
