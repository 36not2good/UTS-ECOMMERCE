import React, { useState, useContext } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Box,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Register = () => {
  const { login } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [activeStep] = useState(0);

  // Cek jika redirect dari proses checkout
  const fromCheckout = location.state?.fromCheckout || false;

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, 'Nama hanya boleh mengandung huruf dan spasi')
      .required('Nama lengkap wajib diisi'),
    email: Yup.string()
      .email('Email tidak valid')
      .required('Email wajib diisi'),
    password: Yup.string()
      .min(6, 'Password minimal 6 karakter')
      .required('Password wajib diisi'),
    phone: Yup.string()
      .matches(/^628\d{8,11}$/, 'Nomor WhatsApp harus diawali 628')
      .required('Nomor WhatsApp wajib diisi'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');

      await new Promise((resolve) => setTimeout(resolve, 1000));

      login({
        email: values.email,
        role: 'customer',
      });

      if (fromCheckout) {
        navigate('/checkout');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Registrasi gagal. Email mungkin sudah terdaftar.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = ['Data Diri', 'Verifikasi', 'Selesai'];

  return (
    <Container
      maxWidth='sm'
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Paper elevation={3} sx={{ p: 4 }}>
        {fromCheckout && (
          <Alert severity='info' sx={{ mb: 3 }}>
            Silakan daftar atau login untuk menyelesaikan checkout
          </Alert>
        )}

        {error && (
          <Alert severity='error' sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Typography variant='h4' component='h1' gutterBottom align='center'>
          {fromCheckout ? 'Daftar untuk Checkout' : 'Daftar Akun Baru'}
        </Typography>

        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            phone: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name='name'
                    label='Nama Lengkap'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    error={touched.name && Boolean(errors.name)}
                    helperText={<ErrorMessage name='name' />}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name='email'
                    label='Email'
                    type='email'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    error={touched.email && Boolean(errors.email)}
                    helperText={<ErrorMessage name='email' />}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name='password'
                    label='Password'
                    type='password'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    error={touched.password && Boolean(errors.password)}
                    helperText={<ErrorMessage name='password' />}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name='phone'
                    label='Nomor WhatsApp (628...)'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={<ErrorMessage name='phone' />}
                    InputProps={{
                      startAdornment: <span style={{ marginRight: 8 }}>+</span>,
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
                size='large'
                sx={{ mt: 3 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Mendaftarkan...' : 'Daftar Sekarang'}
              </Button>
            </Form>
          )}
        </Formik>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant='body2'>
            Sudah punya akun?{' '}
            <Link
              component='button'
              onClick={() => navigate('/login', { state: { fromCheckout } })}
              sx={{ fontWeight: 500 }}
            >
              Login disini
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
