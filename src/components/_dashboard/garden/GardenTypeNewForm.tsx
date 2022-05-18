import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import {
  Card,
  Box,
  Chip,
  Grid,
  Stack,
  Radio,
  Switch,
  Select,
  TextField,
  InputLabel,
  Typography,
  RadioGroup,
  FormControl,
  Autocomplete,
  InputAdornment,
  FormHelperText,
  FormControlLabel
} from '@material-ui/core';
// utils
import { manageGarden } from '_apis_/garden';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { GardenType } from '../../../@types/garden';
//
import { QuillEditor } from '../../editor';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

type GardenNewFormProps = {
  isEdit: boolean;
  // currentUser?: UserManager;
  currentGardenType?: GardenType;
};

export default function GardenNewForm({ isEdit, currentGardenType }: GardenNewFormProps) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewGardenSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    imageUrl: Yup.array().min(1, 'Images is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentGardenType?.id || '',
      name: currentGardenType?.name || '',
      description: currentGardenType?.description || ''
    },
    validationSchema: NewGardenSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        !isEdit
          ? await manageGarden.createGardenType(values).then((response) => {
              if (response.status == 200) {
                resetForm();
                setSubmitting(false);
                enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', {
                  variant: 'success'
                });
                navigate(PATH_DASHBOARD.garden.typesList);
              } else {
                enqueueSnackbar(!isEdit ? 'Create error' : 'Update error', { variant: 'error' });
              }
            })
          : await manageGarden.updateGardenType(values).then((response) => {
              if (response.status == 200) {
                resetForm();
                setSubmitting(false);
                enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', {
                  variant: 'success'
                });
                navigate(PATH_DASHBOARD.garden.typesList);
              } else {
                enqueueSnackbar(!isEdit ? 'Create error' : 'Update error', { variant: 'error' });
              }
            });
      } catch (error) {
        enqueueSnackbar(!isEdit ? 'Create error' : 'Update error', { variant: 'error' });
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <div>
                    <LabelStyle>Description</LabelStyle>
                    <QuillEditor
                      simple
                      id="description"
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
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Garden Type' : 'Save Changes'}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
