import * as Yup from 'yup';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { styled } from '@material-ui/core/styles';
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
  FormHelperText,
  Card,
  Stack,
  Typography
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { manageCoral } from '_apis_/coral';
import useLocales from '../../../hooks/useLocales';
// @types
import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';

// ----------------------------------------------------------------------
const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

type CreatePhaseNewFormDialogProps = {
  open: boolean;
  onClose: any;
};

export default function CreatePhaseNewFormDialog({ open, onClose }: CreatePhaseNewFormDialogProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: '',
      description: '',
      imageUrl: []
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        console.log('submit');
        const bodyFormData = new FormData();
        bodyFormData.append('name', values.name);
        bodyFormData.append('description', values.description);
        values.imageUrl.map((file: File | string) => bodyFormData.append('imageFile', file));

        await manageCoral.createCoralPhases(bodyFormData).then((response) => {
          if (response.status == 200) {
            resetForm();
            setSubmitting(false);
            enqueueSnackbar(translate('message.create-success'), {
              variant: 'success'
            });
            onClose(response.data);
          } else {
            enqueueSnackbar(translate('message.create-error'), { variant: 'error' });
          }
        });

        // navigate(PATH_DASHBOARD.phases.new);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        // setErrors(error);
      }
    }
  });

  const { errors, values, touched, isSubmitting, handleSubmit, setFieldValue, getFieldProps } =
    formik;
  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFieldValue(
        'imageUrl',
        acceptedFiles.map((file: File | string) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    },
    [setFieldValue]
  );
  const handleRemoveAll = () => {
    setFieldValue('imageUrl', []);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = values.imageUrl.filter((_file) => _file !== file);
    setFieldValue('imageUrl', filteredItems);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Add new phase</DialogTitle>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      label="Phases name"
                      {...getFieldProps('name')}
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Stack>

                  <div>
                    <LabelStyle>Description</LabelStyle>
                    <QuillEditor
                      simple
                      id="product-description"
                      value={values.description}
                      onChange={(val) => setFieldValue('description', val)}
                      error={Boolean(touched.description && errors.description)}
                    />
                    {touched.description && errors.description && (
                      <FormHelperText error sx={{ px: 2 }}>
                        {touched.description && errors.description}
                      </FormHelperText>
                    )}
                  </div>

                  <div>
                    <LabelStyle>Add Images</LabelStyle>
                    <UploadMultiFile
                      showPreview
                      maxSize={3145728}
                      accept="image/*"
                      files={values.imageUrl}
                      onDrop={handleDrop}
                      onRemove={handleRemove}
                      onRemoveAll={handleRemoveAll}
                      error={Boolean(touched.imageUrl && errors.imageUrl)}
                    />
                    {touched.imageUrl && errors.imageUrl && (
                      <FormHelperText error sx={{ px: 2 }}>
                        {touched.imageUrl && errors.imageUrl}
                      </FormHelperText>
                    )}
                  </div>

                  <DialogActions>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      Create new
                    </LoadingButton>
                    <Button type="button" color="inherit" variant="outlined" onClick={onClose}>
                      Cancel
                    </Button>
                  </DialogActions>
                </Stack>
              </Card>
            </Grid>
            {/* <Grid container spacing={3} direction="column">
              <Grid item>
                <RadioGroup row {...getFieldProps('addressType')}>
                  <FormControlLabel value="Home" control={<Radio />} label="Home" sx={{ mr: 2 }} />
                  <FormControlLabel value="Office" control={<Radio />} label="Office" />
                </RadioGroup>
              </Grid>

              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      {...getFieldProps('receiver')}
                      error={Boolean(touched.receiver && errors.receiver)}
                      helperText={touched.receiver && errors.receiver}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      {...getFieldProps('phone')}
                      error={Boolean(touched.phone && errors.phone)}
                      helperText={touched.phone && errors.phone}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  label="Address"
                  {...getFieldProps('address')}
                  error={Boolean(touched.address && errors.address)}
                  helperText={touched.address && errors.address}
                />
              </Grid>

              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Town / City"
                      {...getFieldProps('city')}
                      error={Boolean(touched.city && errors.city)}
                      helperText={touched.city && errors.city}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="State"
                      {...getFieldProps('state')}
                      error={Boolean(touched.state && errors.state)}
                      helperText={touched.state && errors.state}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Zip / Postal Code"
                      {...getFieldProps('zipcode')}
                      error={Boolean(touched.zipcode && errors.zipcode)}
                      helperText={touched.zipcode && errors.zipcode}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <TextField
                  select
                  fullWidth
                  label="Country"
                  placeholder="Country"
                  {...getFieldProps('country')}
                  SelectProps={{ native: true }}
                  error={Boolean(touched.country && errors.country)}
                  helperText={touched.country && errors.country}
                >
                  {countries.map((option) => (
                    <option key={option.code} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </TextField>

                <FormControlLabel
                  control={<Checkbox checked={values.isDefault} {...getFieldProps('isDefault')} />}
                  label="Use this address as default."
                  sx={{ mt: 3 }}
                />
              </Grid>
            </Grid> */}
          </DialogContent>

          <Divider />

          {/* <DialogActions>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Deliver to this Address
            </LoadingButton>
            <Button type="button" color="inherit" variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </DialogActions> */}
        </Form>
      </FormikProvider>
    </Dialog>
  );
}
