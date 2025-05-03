'use client';

import { useCallback } from 'react';
import ErrorFeedback from '@/app/_shared/errors/ErrorFeedback';
import { useRouter } from 'next/navigation';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  const handleRefresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const errorMessage =
    process.env.NODE_ENV === 'development'
      ? error.message
      : 'Error loading dashboard content';

  return (
    <ErrorFeedback
      title='Dashboard Error'
      message={errorMessage}
      primaryAction={{
        label: 'Try again',
        onClick: reset,
      }}
      secondaryAction={{
        label: 'Refresh page',
        onClick: handleRefresh,
      }}
    />
  );
}
