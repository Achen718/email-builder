import { useToast } from '@chakra-ui/react';
import { getErrorMessage } from '@/utils/getErrorMessage';

export const useNotification = () => {
  const toast = useToast();

  const showSuccess = (title: string) => {
    toast({
      title,
      status: 'success',
      duration: 3000,
    });
  };

  const showError = (title: string, error: unknown) => {
    toast({
      title,
      description: getErrorMessage(error),
      status: 'error',
      duration: 5000,
    });
  };

  return { showSuccess, showError };
};
