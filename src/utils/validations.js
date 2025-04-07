import * as Yup from 'yup';

export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Name must contain only letters and spaces')
    .required('Name is required')
    .test('proper-case', 'Name must be in proper case', (value) => {
      if (!value) return true;
      return value
        .split(' ')
        .every(
          (word) =>
            word.length === 0 ||
            (word[0] === word[0].toUpperCase() &&
              word.slice(1) === word.slice(1).toLowerCase())
        );
    }),
  username: Yup.string()
    .matches(
      /^[a-z0-9]+$/,
      'Username must be lowercase letters and numbers only'
    )
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must not exceed 20 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  whatsapp: Yup.string()
    .matches(
      /^628\d{8,11}$/,
      'WhatsApp number must start with 628 and be 11-14 digits total'
    )
    .required('WhatsApp number is required'),
  role: Yup.string()
    .oneOf(['customer'], 'Role must be customer')
    .required('Role is required'),
});

export const loginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});
