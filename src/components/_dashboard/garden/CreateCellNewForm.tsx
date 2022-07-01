import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
// material
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
  Box,
  Typography
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { MIconButton } from 'components/@material-extend';
// ----------------------------------------------------------------------

type CreateCellNewFormProps = {
  open: boolean;
  onClose: VoidFunction;
};

// export default function CheckoutNewAddressForm({ open, onClose }: CheckoutNewAddressFormProps) {
export default function CreateCellNewForm({ open, onClose }: CreateCellNewFormProps) {
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
        setSubmitting(true);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  const Incrementer = ({ name }: { name: string }) => {
    // const { value } = field;
    // const { setValue } = helpers;

    const incrementQuantity = () => {
      // setValue(1);
    };
    const decrementQuantity = () => {
      // setValue(1);
    };

    return (
      <Box
        sx={{
          py: 0.5,
          px: 0.75,
          border: 1,
          lineHeight: 0,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          borderColor: 'grey.50032'
        }}
      >
        <MIconButton size="small" color="inherit" disabled={0 <= -1} onClick={decrementQuantity}>
          <Icon icon={minusFill} width={16} height={16} />
        </MIconButton>
        <Typography
          variant="body2"
          component="span"
          sx={{
            width: 40,
            textAlign: 'center',
            display: 'inline-block'
          }}
        >
          1
        </Typography>
        <MIconButton size="small" color="inherit" onClick={incrementQuantity}>
          <Icon icon={plusFill} width={16} height={16} />
        </MIconButton>
      </Box>
    );
  };
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Thêm mới Cell</DialogTitle>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3} direction="column">
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        mb: 3,
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                        Quantity
                      </Typography>

                      <div>
                        <Incrementer name="quantity" />
                      </div>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Full Name" {...getFieldProps('receiver')} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        mb: 3,
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                        Quantity
                      </Typography>

                      <div>
                        <Incrementer name="quantity" />
                      </div>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Full Name" {...getFieldProps('receiver')} />
                  </Grid>
                </Grid>
              </Grid>
              <Divider sx={{ padding: 1 }} />
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        mb: 3,
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                        Quantity
                      </Typography>

                      <div>
                        <Incrementer name="quantity" />
                      </div>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Full Name" {...getFieldProps('receiver')} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        mb: 3,
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                        Quantity
                      </Typography>

                      <div>
                        <Incrementer name="quantity" />
                      </div>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Full Name" {...getFieldProps('receiver')} />
                  </Grid>
                </Grid>
              </Grid>
              <Divider sx={{ padding: 1 }} />
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        mb: 3,
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                        Quantity
                      </Typography>

                      <div>
                        <Incrementer name="quantity" />
                      </div>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Full Name" {...getFieldProps('receiver')} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        mb: 3,
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                        Quantity
                      </Typography>

                      <div>
                        <Incrementer name="quantity" />
                      </div>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Full Name" {...getFieldProps('receiver')} />
                  </Grid>
                </Grid>
              </Grid>
              <Divider sx={{ padding: 1 }} />
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        mb: 3,
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                        Quantity
                      </Typography>

                      <div>
                        <Incrementer name="quantity" />
                      </div>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Full Name" {...getFieldProps('receiver')} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        mb: 3,
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                        Quantity
                      </Typography>

                      <div>
                        <Incrementer name="quantity" />
                      </div>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Full Name" {...getFieldProps('receiver')} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Button size="small" startIcon={<Icon icon={plusFill} />}>
                  {/* <Button size="small" onClick={handleClickOpen} startIcon={<Icon icon={plusFill} />}> */}
                  Thêm mới cell
                </Button>
              </Grid>
            </Grid>
          </DialogContent>

          <Divider />

          <DialogActions>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Deliver to this Address
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
