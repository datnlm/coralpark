import * as Yup from 'yup';
import { useState } from 'react';
import { useSnackbar } from 'notistack5';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import {
  Link,
  Stack,
  Alert,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { codes, emailError } from 'utils/helpError';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
//
import { MIconButton } from '../../@material-extend';

// ----------------------------------------------------------------------
type InitialValues = {
  email: string;
  password: string;
  remember: boolean;
  afterSubmit?: string;
  failedLoginAttempts?: string;
};
export default function LoginForm() {
  const { login } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    // email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    email: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik<InitialValues>({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      let flag = false;
      const failedLoginAttempts = localStorage.getItem('failedLoginAttempts');
      if (failedLoginAttempts && Number(failedLoginAttempts) >= 5) {
        resetForm();
        setSubmitting(false);
        setErrors({ failedLoginAttempts: 'Too many failed login attempts' });
        if (localStorage.getItem('expiration')) {
          const expiration = new Date(localStorage.getItem('expiration')!);
          if (new Date().valueOf() - expiration.valueOf() == 0) {
            localStorage.clear();
            flag = true;
          }
        }
      } else {
        try {
          await login(values.email, values.password);
          enqueueSnackbar('Login success', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
          if (isMountedRef.current) {
            setSubmitting(false);
          }
        } catch (error) {
          console.error(error);
          resetForm();
          if (isMountedRef.current) {
            setSubmitting(false);
            setErrors({ afterSubmit: 'The email address or password are not valid.' });

            // set login 5 failed
            // failedLoginAttempts
            const failedLoginAttempts = localStorage.getItem('failedLoginAttempts');
            if (failedLoginAttempts == null) {
              localStorage.setItem('failedLoginAttempts', '1');
            } else {
              localStorage.setItem(
                'failedLoginAttempts',
                (Number(failedLoginAttempts) + 1).toString()
              );
              const event = new Date();
              event.setMinutes(5);
              localStorage.setItem('expiration', event.toDateString());
            }
          }
        }
      }
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
          {errors.failedLoginAttempts && (
            <Alert variant="filled" severity="error" onClose={() => {}}>
              {errors.failedLoginAttempts}
            </Alert>
          )}

          <TextField
            fullWidth
            autoComplete="username"
            // type="email"
            label="Username"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
