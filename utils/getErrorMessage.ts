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

  // For standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // For RTK Query errors (using type assertion)
  if (typeof error === 'object') {
    const err = error as ErrorWithMessage;

    // Check common error message locations in order of preference
    if (err.data?.error) return err.data.error;
    if (err.data?.message) return err.data.message;
    if (err.error) return err.error;
    if (typeof err.message === 'string') return err.message;
  }

  // For string errors
  if (typeof error === 'string') {
    return error;
  }

  // Fallback: stringify if possible
  try {
    return JSON.stringify(error);
  } catch {
    return 'An unexpected error occurred';
  }
};
