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
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { UserManager } from '../../../@types/user';
//
import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';

// ----------------------------------------------------------------------
import countries from './countries';

const GENDER_OPTION = ['Men', 'Women', 'Kids'];

const TAGS_OPTION = [
  'Toy Story 3',
  'Logan',
  'Full Metal Jacket',
  'Dangal',
  'The Sting',
  '2001: A Space Odyssey',
  "Singin' in the Rain",
  'Toy Story',
  'Bicycle Thieves',
  'The Kid',
  'Inglourious Basterds',
  'Snatch',
  '3 Idiots'
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

type UserNewFormProps = {
  isEdit: boolean;
  currentUser?: UserManager;
};

export default function UserNewForm({ isEdit, currentUser }: UserNewFormProps) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    scientific: Yup.string().required('Scientific is required'),
    logevity: Yup.string().required('Logevity is required'),
    country: Yup.string().required('Country is required'),
    exhibit: Yup.string().required('Exhibit is required'),
    sexual: Yup.string().required('Sexual is required'),
    nutrition: Yup.string().required('Nutrition is required'),
    colour: Yup.string().required('Colour is required'),
    habital: Yup.string().required('Habital is required'),
    current: Yup.string().required('Current is required'),
    bathymetry: Yup.string().required('Bathymetry is required'),
    temperature: Yup.string().required('Temperature is required'),
    brightness: Yup.string().required('Brightness is required'),
    tides: Yup.string().required('Tides is required'),
    description: Yup.string().required('Description is required'),
    images: Yup.array().min(1, 'Images is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentUser?.name || '',
      scientific: currentUser?.scientific || '',
      logevity: currentUser?.logevity || '',
      country: currentUser?.country || '',
      exhibit: currentUser?.exhibit || '',
      sexual: currentUser?.sexual || '',
      nutrition: currentUser?.nutrition || '',
      colour: currentUser?.colour || '',
      type: currentUser?.type || '',
      habital: currentUser?.habital || '',
      current: currentUser?.current || '',
      bathymetry: currentUser?.bathymetry || '',
      temperature: currentUser?.temperature || '',
      brightness: currentUser?.brightness || '',
      tides: currentUser?.tides || '',
      description: currentUser?.description || '',
      images: currentUser?.images || []
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await fakeRequest(500);
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.eCommerce.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFieldValue(
        'images',
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
    setFieldValue('images', []);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = values.images.filter((_file: string | File) => _file !== file);
    setFieldValue('images', filteredItems);
  };

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
                    label="Full Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label="Scientific Name"
                    {...getFieldProps('scientific')}
                    error={Boolean(touched.scientific && errors.scientific)}
                    helperText={touched.scientific && errors.scientific}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Longevity"
                    {...getFieldProps('logevity')}
                    error={Boolean(touched.logevity && errors.logevity)}
                    helperText={touched.logevity && errors.logevity}
                  />
                  <Autocomplete
                    id="country-select-demo"
                    fullWidth
                    options={countries}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <img
                          loading="lazy"
                          width="20"
                          src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                          srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                          alt=""
                        />
                        {option.label}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Choose a country"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password' // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Exhibit Social"
                    {...getFieldProps('exhibit')}
                    error={Boolean(touched.exhibit && errors.exhibit)}
                    helperText={touched.exhibit && errors.exhibit}
                  />
                  <TextField
                    fullWidth
                    label="Sexual Behaviors"
                    {...getFieldProps('sexual')}
                    error={Boolean(touched.sexual && errors.sexual)}
                    helperText={touched.sexual && errors.sexual}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Nutrition"
                    {...getFieldProps('nutrition')}
                    error={Boolean(touched.nutrition && errors.nutrition)}
                    helperText={touched.nutrition && errors.nutrition}
                  />
                  <TextField
                    fullWidth
                    label="Colour"
                    {...getFieldProps('colour')}
                    error={Boolean(touched.colour && errors.colour)}
                    helperText={touched.colour && errors.colour}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Coral Type"
                    placeholder="Country"
                    {...getFieldProps('country')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.country && errors.country)}
                    helperText={touched.country && errors.country}
                  >
                    <option value="" />
                    {countries.map((option) => (
                      <option key={option.code} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                  {/* <TextField
                    select
                    fullWidth
                    label="Habital"
                    placeholder="Habital"
                    {...getFieldProps('habital')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.habital && errors.habital)}
                    helperText={touched.habital && errors.habital}
                  >
                    <option value="" />
                    {countries.map((option) => (
                      <option key={option.code} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField> */}
                  <TextField
                    fullWidth
                    label="Current"
                    {...getFieldProps('current')}
                    error={Boolean(touched.current && errors.current)}
                    helperText={touched.current && errors.current}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Bathymetry"
                    {...getFieldProps('bathymetry')}
                    error={Boolean(touched.bathymetry && errors.bathymetry)}
                    helperText={touched.bathymetry && errors.bathymetry}
                  />
                  <TextField
                    fullWidth
                    label="Temperature"
                    {...getFieldProps('temperature')}
                    error={Boolean(touched.temperature && errors.temperature)}
                    helperText={touched.temperature && errors.temperature}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Brightness"
                    {...getFieldProps('brightness')}
                    error={Boolean(touched.brightness && errors.brightness)}
                    helperText={touched.brightness && errors.brightness}
                  />
                  <TextField
                    fullWidth
                    // label="Role"
                    label="Tides"
                    {...getFieldProps('tides')}
                    error={Boolean(touched.tides && errors.tides)}
                    helperText={touched.tides && errors.tides}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
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
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <div>
                    <LabelStyle>Add Images</LabelStyle>
                    <UploadMultiFile
                      showPreview
                      maxSize={3145728}
                      accept="image/*"
                      files={values.images}
                      onDrop={handleDrop}
                      onRemove={handleRemove}
                      onRemoveAll={handleRemoveAll}
                      error={Boolean(touched.images && errors.images)}
                    />
                    {touched.images && errors.images && (
                      <FormHelperText error sx={{ px: 2 }}>
                        {touched.images && errors.images}
                      </FormHelperText>
                    )}
                  </div>
                </Stack>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Coral' : 'Save Changes'}
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
