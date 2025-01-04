import { useState, ChangeEvent } from 'react';

export const useForm = <T extends Record<string, any>>(initialValue: T) => {
  const [formFields, setFormFields] = useState(initialValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormFields((prevFields) => ({ ...prevFields, [name]: value }));
  };

  return { formFields, handleChange };
};
