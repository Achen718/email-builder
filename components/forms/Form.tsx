'use client';
import { useState, FormEvent, ChangeEvent, useCallback } from 'react';
import { Box, Stack } from '@chakra-ui/react';
import FormContainer from './formContainer/FormContainer';
import FormInput from './formInput/FormInput';
import FormButton from './formButton/FormButton';

interface FormField {
  id: string;
  label: string;
  type: string;
  name: string;
  isRequired?: boolean;
}

interface FormProps {
  title: string;
  fields: FormField[];
  onSubmit: (formData: { [key: string]: string }) => void;
  initialValues: { [key: string]: string };
  buttonText: string;
  loading: boolean;
  children?: React.ReactNode;
}

const Form: React.FC<FormProps> = ({
  title,
  fields,
  onSubmit,
  initialValues,
  buttonText,
  loading,
  children,
}) => {
  const [formFields, setFormFields] = useState(initialValues);

  const lastField = fields[fields.length - 1];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({ ...prevFields, [name]: value }));
  };

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmit(formFields);
    },
    [formFields, onSubmit]
  );

  return (
    <FormContainer title={title}>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <Box key={field.id}>
            <FormInput
              id={field.id}
              label={field.label}
              type={field.type}
              name={field.name}
              value={formFields[field.name]}
              onChange={handleChange}
              isRequired={field.isRequired}
            />
            {children && field === lastField && <Box mt={2}>{children}</Box>}
          </Box>
        ))}
        <Stack spacing={10} pt={2}>
          <FormButton buttonText={buttonText} loading={loading} type='submit' />
        </Stack>
      </form>
    </FormContainer>
  );
};

export default Form;
