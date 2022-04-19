import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { manageArea } from '_apis_/area';
// material
import { styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import {
  Card,
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
import { Area } from '../../../@types/user';
//
import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';
// import Button from 'theme/overrides/Button';

// ----------------------------------------------------------------------

const GENDER_OPTION = ['Men', 'Women', 'Kids'];

const CATEGORY_OPTION = [
  { group: 'Province', classify: ['Vĩnh Long', 'Kiên Giang', 'Phan Thiết', 'Nha Trang', 'string'] }
];

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

type ProductNewFormProps = {
  isEdit: boolean;
  currentArea?: Area;
};

export default function ProductNewForm({ isEdit, currentArea }: ProductNewFormProps) {
  // const [currentProvince, setCurrentProvince] = useState('');
  // const provice = typeof currentArea?.province === 'undefined' ? '' : currentArea?.province;
  // setCurrentProvince(provice);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const NewProductSchema = Yup.object().shape({
    location: Yup.string().required('Location is required'),
    address: Yup.string().required('Address is required'),
    province: Yup.string().required('Province is required')
  });

  const checkSelected = (provice: string) => {
    return (
      <option key={provice} value={provice}>
        {provice}
      </option>
    );
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      location: currentArea?.location || '',
      address: currentArea?.address || '',
      province: currentArea?.provinceName || ' '
    },

    // onSubmit: (values) => {
    //   console.log('hello');s
    // },
    validationSchema: NewProductSchema,

    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      // console.log(currentArea!.id);
      try {
        // console.log(values);

        if (isEdit) {
          await manageArea.updateArea(
            currentArea!.id,
            values.location,
            values.address,
            values.province
          );
        } else {
          console.log('create');
          await manageArea.createArea(values.location, values.address, values.province);
        }

        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.area.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        // setErrors(error);
      }
    }
  });

  const {
    errors,
    values,
    touched,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    getFieldProps,
    handleChange
  } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="location"
                  {...getFieldProps('location')}
                  error={Boolean(touched.location && errors.location)}
                  helperText={touched.location && errors.location}
                />
                <TextField
                  fullWidth
                  label="address"
                  {...getFieldProps('address')}
                  error={Boolean(touched.address && errors.address)}
                  helperText={touched.address && errors.address}
                />
                <FormControl fullWidth>
                  <InputLabel>Province</InputLabel>
                  <Select
                    // defaultValue={values.province}
                    label="province"
                    native
                    {...getFieldProps('province')}
                  >
                    {CATEGORY_OPTION.map((category) => (
                      <optgroup key={category.group} label={category.group}>
                        {category.classify.map((classify) => checkSelected(classify))}
                      </optgroup>
                    ))}
                  </Select>
                </FormControl>
                <LoadingButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                >
                  {!isEdit ? 'Create Area' : 'Save Changes'}
                </LoadingButton>
                {/* <button type="submit"> sssss</button> */}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
