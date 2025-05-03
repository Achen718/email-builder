'use client';

import { useCallback } from 'react';
import ErrorFeedback from '@/app/_shared/errors/ErrorFeedback';
import { useRouter } from 'next/navigation';

export default function TemplateEditorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  const handleNavigateBack = useCallback(() => {
    router.push('/dashboard/templates');
  }, [router]);

  return (
    <ErrorFeedback
      title='Template Editor Error'
      message={error.message || 'Failed to load the template editor'}
      primaryAction={{
        label: 'Try again',
        onClick: reset,
      }}
      secondaryAction={{
        label: 'Back to templates',
        onClick: handleNavigateBack,
      }}
    />
  );
}
