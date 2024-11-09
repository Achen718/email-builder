'use client';

import { FormControl, FormLabel, Input, InputProps } from '@chakra-ui/react';

interface FormInputProps extends InputProps {
  id: string;
  label: string;
  isRequired?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  isRequired = false,
  ...inputProps
}) => {
  return (
    <FormControl id={id} isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      <Input {...inputProps} />
    </FormControl>
  );
};

export default FormInput;
