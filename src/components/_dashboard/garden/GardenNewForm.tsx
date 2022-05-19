import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
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
import { manageArea } from '_apis_/area';
import { manageGarden } from '_apis_/garden';
import { OptionStatus, statusOptions } from 'utils/constants';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Garden } from '../../../@types/garden';
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

type GardenNewFormProps = {
  isEdit: boolean;
  // currentUser?: UserManager;
  currentGarden?: Garden;
};

export default function GardenNewForm({ isEdit, currentGarden }: GardenNewFormProps) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [optionsGardenType, setOptionsGardenType] = useState([]);
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
  const [optionsSite, setOptionsSite] = useState([]);
  const [optionsArea, setOptionsArea] = useState([]);
  const NewGardenSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    latitude: Yup.string().required('Latitude is required'),
    longitude: Yup.string().required('Longitude is required'),
    address: Yup.string().required('Address is required'),
    acreage: Yup.string().required('Acreage is required'),
    quantityOfCells: Yup.string().required('Quantity of Cells is required'),
    areaID: Yup.object().required('Area is required').nullable(true),
    gardenTypeId: Yup.object().required('Garden Type is required').nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentGarden?.id || '',
      name: currentGarden?.name || '',
      latitude: currentGarden?.latitude || '',
      longitude: currentGarden?.longitude || '',
      address: currentGarden?.address || '',
      acreage: currentGarden?.acreage || '',
      quantityOfCells: currentGarden?.quantityOfCells || '',
      areaID: currentGarden?.areaID || '',
      gardenTypeId: currentGarden?.gardenTypeId || '',
      siteId: currentGarden?.siteId || '',
      status: currentGarden?.status || 0
    },
    validationSchema: NewGardenSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let flag = false;

        if (isEdit) {
          values.status = enumStatus!.id;
        }

        !isEdit
          ? await manageGarden.createGarden(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageGarden.updateGarden(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            });
        if (flag) {
          resetForm();
          setSubmitting(false);
          enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', {
            variant: 'success'
          });
          navigate(PATH_DASHBOARD.garden.list);
        } else {
          enqueueSnackbar(!isEdit ? 'Create error' : 'Update error', { variant: 'error' });
        }
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

  // const handleRemoveAll = () => {
  //   setFieldValue('images', []);
  // };

  // const handleRemove = (file: File | string) => {
  //   const filteredItems = values.imageUrl.filter((_file: string | File) => _file !== file);
  //   setFieldValue('images', filteredItems);
  // };
  useEffect(() => {
    setEnumStatus(statusOptions.find((e) => e.id == currentGarden?.status) || null);
  }, [currentGarden]);

  useEffect(() => {
    manageGarden.getListGardenType().then((response) => {
      if (response.status == 200) {
        setOptionsGardenType(response.data.items);
      } else {
        setOptionsGardenType([]);
      }
    });

    manageArea.getArea().then((response) => {
      if (response.status == 200) {
        setOptionsArea(response.data.items);
        // setFieldValue('areaID', { id: 1, wellKnownText: 'string', address: 'string' });
      } else {
        setOptionsArea([]);
      }
    });

    manageGarden.getListSites().then((response) => {
      if (response.status == 200) {
        setOptionsSite(response.data.items);
      } else {
        setOptionsSite([]);
      }
    });
  }, []);
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
                    label="Garden Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label="Address"
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    {...getFieldProps('latitude')}
                    error={Boolean(touched.latitude && errors.latitude)}
                    helperText={touched.latitude && errors.latitude}
                  />
                  <TextField
                    fullWidth
                    label="Longitude"
                    {...getFieldProps('longitude')}
                    error={Boolean(touched.longitude && errors.longitude)}
                    helperText={touched.longitude && errors.longitude}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Acreage"
                    {...getFieldProps('acreage')}
                    error={Boolean(touched.acreage && errors.acreage)}
                    helperText={touched.acreage && errors.acreage}
                  />
                  <TextField
                    fullWidth
                    label="Quantity of Cells"
                    {...getFieldProps('quantityOfCells')}
                    error={Boolean(touched.quantityOfCells && errors.quantityOfCells)}
                    helperText={touched.quantityOfCells && errors.quantityOfCells}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    clearIcon
                    id="areaID"
                    {...getFieldProps('areaID')}
                    options={optionsArea}
                    getOptionLabel={(option: any) => (option ? option.address : '')}
                    onChange={(e, value: any) =>
                      value ? { ...setFieldValue('areaID', value) } : ''
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Area"
                        error={Boolean(touched.areaID && errors.areaID)}
                        helperText={touched.areaID && errors.areaID}
                      />
                    )}
                  />

                  <Autocomplete
                    fullWidth
                    disablePortal
                    clearIcon
                    id="gardenTypeId"
                    {...getFieldProps('gardenTypeId')}
                    options={optionsGardenType}
                    getOptionLabel={(option: any) => (option ? option.name : '')}
                    onChange={(e, value: any) =>
                      value ? { ...setFieldValue('gardenTypeId', value) } : ''
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Type"
                        error={Boolean(touched.gardenTypeId && errors.gardenTypeId)}
                        helperText={touched.gardenTypeId && errors.gardenTypeId}
                      />
                    )}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    clearIcon
                    id="sites"
                    {...getFieldProps('siteId')}
                    options={optionsSite}
                    getOptionLabel={(option: any) => (option ? option.name : '')}
                    onChange={(e, value: any) =>
                      value ? { ...setFieldValue('siteId', value) } : ''
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Sites"
                        error={Boolean(touched.siteId && errors.siteId)}
                        helperText={touched.siteId && errors.siteId}
                      />
                    )}
                  />
                  {isEdit && (
                    <Autocomplete
                      fullWidth
                      disablePortal
                      clearIcon
                      id="status"
                      value={enumStatus}
                      options={statusOptions}
                      getOptionLabel={(option: OptionStatus) => option.label}
                      // getOptionLabel={(option: any) => (option ? option.name : '')}
                      onChange={(e, values: OptionStatus | null) => setEnumStatus(values)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Status"
                          error={Boolean(touched.status && errors.status)}
                          helperText={touched.status && errors.status}
                        />
                      )}
                    />
                  )}
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Garden' : 'Save Changes'}
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
