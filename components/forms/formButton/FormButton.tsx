import { Button, ButtonProps } from '@chakra-ui/react';

interface FormButtonProps extends ButtonProps {
  buttonText: string;
  loading: boolean;
}

const FormButton: React.FC<FormButtonProps> = ({
  buttonText,
  loading,
  ...buttonProps
}) => {
  return (
    <Button
      isLoading={loading}
      loadingText='Submitting'
      size='lg'
      bg={'blue.400'}
      color={'white'}
      _hover={{
        bg: 'blue.500',
      }}
      {...buttonProps}
    >
      {buttonText}
    </Button>
  );
};

export default FormButton;
