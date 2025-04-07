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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      await new Promise((resolve) => setTimeout(resolve, 1000));

      login({
        username: values.username,
        role: values.username.includes('admin')
          ? 'admin'
          : values.username.includes('cashier')
          ? 'cashier'
          : 'customer',
      });

      if (values.username.includes('admin')) {
        navigate('/admin-dashboard');
      } else if (values.username.includes('cashier')) {
        navigate('/cashier-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container
      maxWidth='xs'
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant='h4'
          component='h1'
          gutterBottom
          align='center'
          sx={{ fontWeight: 'bold' }}
        >
          Login
        </Typography>

        {error && (
          <Alert severity='error' sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Field
                as={TextField}
                name='username'
                label='Username'
                variant='outlined'
                fullWidth
                margin='normal'
                error={touched.username && Boolean(errors.username)}
                helperText={<ErrorMessage name='username' />}
              />

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

              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
                size='large'
                sx={{ mt: 2 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </Form>
          )}
        </Formik>

        <Grid container justifyContent='center' sx={{ mt: 3 }}>
          <Grid item>
            <Link
              component='button'
              variant='body2'
              underline='hover'
              onClick={() => navigate('/register')}
            >
              Tidak punya akun?
            </Link>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant='body2' color='text.secondary' align='center'>
            <strong>Akun Demo:</strong>
            <br />
            admin / password123 (Admin)
            <br />
            customer / password123 (Customer)
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
