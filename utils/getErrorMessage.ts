interface ErrorWithMessage {
  message?: string;
  error?: string;
  data?: {
    error?: string;
    message?: string;
  };
}

export const getErrorMessage = (error: unknown): string => {
  if (!error) return 'An unexpected error occurred';

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object') {
    const err = error as ErrorWithMessage;

    if (err.data?.error) return err.data.error;
    if (err.data?.message) return err.data.message;
    if (err.error) return err.error;
    if (typeof err.message === 'string') return err.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return 'An unexpected error occurred';
  }
};
