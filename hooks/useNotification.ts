import { useToast } from '@chakra-ui/react';
import { getErrorMessage } from '@/utils/getErrorMessage';

export const useNotification = () => {
  const toast = useToast();

  const showSuccess = (title: string, description?: string) => {
    toast({
      title,
      description,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const showError = (title: string, error: unknown) => {
    toast({
      title,
      description: getErrorMessage(error),
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  return { showSuccess, showError };
};
