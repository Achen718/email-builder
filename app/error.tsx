'use client';

import { Button } from '@chakra-ui/react';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to monitoring service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className='flex min-h-screen flex-col items-center justify-center p-4'>
          <div className='w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-lg'>
            <h2 className='text-2xl font-bold'>Something went wrong</h2>
            <p className='text-muted-foreground'>
              {process.env.NODE_ENV === 'development'
                ? error.message
                : 'An unexpected error occurred'}
            </p>
            <Button onClick={reset}>Try again</Button>
          </div>
        </div>
      </body>
    </html>
  );
}
