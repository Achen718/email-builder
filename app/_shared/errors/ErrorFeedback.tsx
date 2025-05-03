'use client';

import { Button } from '@chakra-ui/react';

interface ErrorFeedbackProps {
  title?: string;
  message?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export default function ErrorFeedback({
  title = 'An error occurred',
  message = 'Something went wrong',
  primaryAction,
  secondaryAction,
}: ErrorFeedbackProps) {
  return (
    <div className='flex flex-col items-center justify-center p-8'>
      <div className='w-full max-w-md rounded-lg border p-6 shadow'>
        <h2 className='mb-4 text-xl font-semibold'>{title}</h2>
        <p className='mb-6 text-muted-foreground'>{message}</p>
        <div className='flex gap-3'>
          {primaryAction && (
            <Button onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant='outline' onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
