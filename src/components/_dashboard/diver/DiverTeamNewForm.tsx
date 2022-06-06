import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import { useFormik, Form, FormikProvider } from 'formik';
// material
// material
import { useTheme, styled } from '@material-ui/core/styles';
import {
  Grid,
  Radio,
  Dialog,
  Button,
  Divider,
  Checkbox,
  TextField,
  RadioGroup,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Card,
  Box,
  InputAdornment,
  OutlinedInput,
  Stack,
  FormControl,
  FormGroup
} from '@material-ui/core';
import { useEffect } from 'react';
import { dispatch } from 'redux/store';
import { getListDiver } from 'redux/slices/diver';
import { LoadingButton } from '@material-ui/lab';
import DiverTeamTransferList from './DiverTeamTransferList';

// ----------------------------------------------------------------------

type DiverTeamNewFormProps = {
  open: boolean;
  onClose: VoidFunction;
};

export default function DiverTeamNewForm({ open, onClose }: DiverTeamNewFormProps) {
  const NewAddressSchema = Yup.object().shape({
    receiver: Yup.string().required('Fullname is required'),
    phone: Yup.string().required('Phone is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('State is required')
  });

  const formik = useFormik({
    initialValues: {
      addressType: 'Home',
      receiver: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipcode: '',
      isDefault: true
    },
    validationSchema: NewAddressSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log('call api');
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter
    }),
    '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
    '& fieldset': {
      borderWidth: `1px !important`,
      borderColor: `${theme.palette.grey[500_32]} !important`
    }
  }));

  const { errors, values, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  useEffect(() => {
    dispatch(getListDiver(0, -1));
  }, [dispatch]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Add new address</DialogTitle>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3} direction="column">
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      {...getFieldProps('receiver')}
                      error={Boolean(touched.receiver && errors.receiver)}
                      helperText={touched.receiver && errors.receiver}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  label="Search"
                  type="search"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon icon={searchFill} />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {/* <FormControl component="fieldset">
                      <FormGroup aria-label="position" row>
                        <FormControlLabel control={<Radio checked={false} />} label="Primary" />
                      </FormGroup>
                    </FormControl> */}
                    <DiverTeamTransferList />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>

          <Divider />

          <DialogActions>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Create
            </LoadingButton>
            <Button type="button" color="inherit" variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
}
