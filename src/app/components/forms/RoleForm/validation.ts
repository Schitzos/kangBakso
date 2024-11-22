import * as Yup from 'yup';

// Define the validation schema
export const signInSchemaValidation = Yup.object().shape({
  name: Yup.string()
    .required('Name is required') // Ensure the name is provided
    .max(60, 'Name must not exceed 60 characters'), // Add max length validation
  role: Yup.string()
    .required('Role is required') // Ensure the role is provided
    .oneOf(['Buyer', 'Seller'], 'Invalid role selected'), // Restrict to valid roles
});
