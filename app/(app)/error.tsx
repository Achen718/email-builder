'use client';

import { useCallback } from 'react';
import ErrorFeedback from '@/app/_shared/errors/ErrorFeedback';
import { useRouter } from 'next/navigation';

export default function PrivateAppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  const handleNavigateHome = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <ErrorFeedback
      title='Application Error'
      message={error.message || 'Something went wrong'}
      primaryAction={{
        label: 'Try again',
        onClick: reset,
      }}
      secondaryAction={{
        label: 'Go to home page',
        onClick: handleNavigateHome,
      }}
    />
  );
}
