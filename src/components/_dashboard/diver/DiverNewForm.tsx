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
import { UserManager, Coral } from '../../../@types/user';
//
import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';

// ----------------------------------------------------------------------

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
  // currentUser?: UserManager;
  currentCoral: Coral;
};

export default function UserNewForm({ isEdit, currentCoral }: UserNewFormProps) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    imageUrl: Yup.string().required('imageUrl is required'),
    scientificName: Yup.string().required('scientificName is required'),
    longevity: Yup.string().required('longevity is required'),
    exhibitSocial: Yup.string().required('exhibitSocial is required'),
    sexualBehaviors: Yup.string().required('sexualBehaviors is required'),
    nutrition: Yup.string().required('nutrition is required'),
    colour: Yup.string().required('colour is required'),
    description: Yup.string().required('description is required'),
    coralTypeId: Yup.string().required('coralTypeId is required'),
    status: Yup.string().required('status is required'),
    statusEnum: Yup.string().required('statusEnum is required'),
    className: Yup.string().required('className is required'),
    orderName: Yup.string().required('orderName is required'),
    familyName: Yup.string().required('familyName is required'),
    genusName: Yup.array().min(1, 'genusName is required'),
    speciesName: Yup.array().min(1, 'speciesName is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentCoral?.id || '',
      name: currentCoral?.name || '',
      imageUrl: [],
      scientificName: currentCoral?.scientificName || '',
      longevity: currentCoral?.longevity || '',
      exhibitSocial: currentCoral?.exhibitSocial || '',
      sexualBehaviors: currentCoral?.sexualBehaviors || '',
      nutrition: currentCoral?.nutrition || '',
      colour: currentCoral?.colour || '',
      description: currentCoral?.description || '',
      coralTypeId: currentCoral?.coralTypeId || '',
      status: currentCoral?.status || '',
      statusEnum: currentCoral?.statusEnum || '',
      className: currentCoral?.className || '',
      orderName: currentCoral?.orderName || '',
      familyName: currentCoral?.familyName || '',
      genusName: currentCoral?.genusName || '',
      speciesName: currentCoral?.speciesName || ''
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await fakeRequest(500);
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.area.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  // const handleDrop = useCallback(
  //   (acceptedFiles) => {
  //     setFieldValue(
  //       'images',
  //       acceptedFiles.map((file: File | string) =>
  //         Object.assign(file, {
  //           preview: URL.createObjectURL(file)
  //         })
  //       )
  //     );
  //   },
  //   [setFieldValue]
  // );

  const handleRemoveAll = () => {
    setFieldValue('images', []);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = values.imageUrl.filter((_file: string | File) => _file !== file);
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
                    label="Phone"
                    {...getFieldProps('scientificName')}
                    error={Boolean(touched.scientificName && errors.scientificName)}
                    helperText={touched.scientificName && errors.scientificName}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    {...getFieldProps('longevity')}
                    error={Boolean(touched.longevity && errors.longevity)}
                    helperText={touched.longevity && errors.longevity}
                  />
                  <TextField
                    fullWidth
                    label="Address"
                    {...getFieldProps('genusName')}
                    error={Boolean(touched.genusName && errors.genusName)}
                    helperText={touched.genusName && errors.genusName}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Status"
                    {...getFieldProps('exhibitSocial')}
                    error={Boolean(touched.exhibitSocial && errors.exhibitSocial)}
                    helperText={touched.exhibitSocial && errors.exhibitSocial}
                  />
                </Stack>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Diver' : 'Save Changes'}
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
