import { useState } from 'react';

const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValues = { ...values, [name]: value };
    setValues(newValues);

    // Validate on change if validate function is provided
    if (validate) {
      setErrors(validate(newValues));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (validate) {
      setErrors(validate({ ...values, [name]: value }));
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    handleBlur,
    setValues,
    resetForm,
    isValid: Object.keys(errors).length === 0,
  };
};

export default useForm;