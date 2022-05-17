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
  FormControlLabel,
  Tab
} from '@material-ui/core';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
// utils
import { manageCoral } from '_apis_/coral';
import { manageArea } from '_apis_/area';
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { UserManager, Coral } from '../../../@types/user';
//
import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';

// ----------------------------------------------------------------------
import countries from './countries';
import CoralDetailsCarousel from './CoralDetailsCarousel';
import CoralDetailsSummary from './CoralDetailsSummary';

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

const optionsStatus = [
  { id: 'EX', name: 'Tuyệt chủng' },
  { id: 'EW', name: 'Tuyệt chủng trong tự nhiên' },
  { id: 'CR', name: 'Cực kỳ nguy cấp' },
  { id: 'EN', name: 'Nguy cấp' },
  { id: 'VU', name: 'Sắp nguy cấp' },
  { id: 'NT', name: 'Sắp bị đe doạ' },
  { id: 'CD', name: 'Phụ thuộc bảo tồn' },
  { id: 'LC', name: 'Ít quan tâm' },
  { id: 'DD', name: 'Thiếu dữ liệu' },
  { id: 'NE', name: 'Không được đánh giá' }
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
  const [valueTab, setValueTab] = useState('coral');
  const [optionsGenus, setOptionsGenus] = useState([]);
  const [currentParent, setCurrentParent] = useState<any>([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape(
    valueTab === 'coral'
      ? {
          name: Yup.string().required('Name is required'),
          scientificName: Yup.string().required('Scientific Name is required'),
          longevity: Yup.string().required('Longevity is required'),
          exhibitSocial: Yup.string().required('ExhibitSocial is required'),
          sexualBehaviors: Yup.string().required('SexualBehaviors is required'),
          nutrition: Yup.string().required('Nutrition is required'),
          colour: Yup.string().required('Colour is required'),
          // description: Yup.string().required('Description is required'),
          coralTypeId: Yup.object().required('CoralTypeId is required').nullable(true),
          statusEnum: Yup.object().required('StatusEnum is required').nullable(true)
        }
      : {
          bathymetry: Yup.string().required('Bathymetry is required'),
          temperature: Yup.string().required('Temperature is required'),
          brightness: Yup.string().required('Brightness is required'),
          tides: Yup.string().required('Tides is required'),
          current: Yup.string().required('Current is required')
        }
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentCoral?.id || '',
      name: currentCoral?.name || '',
      imageUrl: [],
      images: currentCoral?.images || [],
      scientificName: currentCoral?.scientificName || '',
      longevity: currentCoral?.longevity || '',
      exhibitSocial: currentCoral?.exhibitSocial || '',
      sexualBehaviors: currentCoral?.sexualBehaviors || '',
      nutrition: currentCoral?.nutrition || '',
      colour: currentCoral?.colour || '',
      description: currentCoral?.description || '',
      coralTypeId: currentCoral?.coralTypeId || null,
      statusEnum: currentCoral?.statusEnum || null,
      bathymetry: '',
      temperature: '',
      brightness: '',
      tides: '',
      current: ''
    },
    // validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        console.log(values);
        if (valueTab === 'coral') {
          const bodyFormData = new FormData();
          bodyFormData.append('Name', values.name);
          bodyFormData.append('ScientificName', values.scientificName);
          bodyFormData.append('Longevity', values.longevity);
          bodyFormData.append('ExhibitSocial', values.exhibitSocial);
          bodyFormData.append('SexualBehaviors', values.sexualBehaviors);
          bodyFormData.append('Nutrition', values.nutrition);
          bodyFormData.append('Colour', values.colour);
          bodyFormData.append('Description', values.description);
          bodyFormData.append('CoralTypeId', values.coralTypeId.id);
          bodyFormData.append('StatusEnum', values.statusEnum.id);
          values.imageUrl.map((file: File | string) => bodyFormData.append('imageFiles', file));
          await manageCoral.createCoral(bodyFormData);
        } else {
          await manageCoral.createHabitat(values);
        }
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.coral.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValueTab(newValue);
  };

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

  useEffect(() => {
    manageCoral.getCoralType('species').then((response) => {
      if (response.status == 200) {
        setOptionsGenus(response.data.items);
      } else {
        setOptionsGenus([]);
      }
    });
  }, []);

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={valueTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
            <Tab label="Coral" value="coral" />
            <Tab label="Habitat" value="habitat" />
            {/* <Tab label="Item Three" value="3" /> */}
          </TabList>
        </Box>
        <TabPanel value="coral">
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
                          {...getFieldProps('scientificName')}
                          error={Boolean(touched.scientificName && errors.scientificName)}
                          helperText={touched.scientificName && errors.scientificName}
                        />
                      </Stack>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField
                          fullWidth
                          label="Longevity"
                          {...getFieldProps('longevity')}
                          error={Boolean(touched.longevity && errors.longevity)}
                          helperText={touched.longevity && errors.longevity}
                        />
                        <TextField
                          fullWidth
                          label="Exhibit Social"
                          {...getFieldProps('exhibitSocial')}
                          error={Boolean(touched.exhibitSocial && errors.exhibitSocial)}
                          helperText={touched.exhibitSocial && errors.exhibitSocial}
                        />
                      </Stack>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField
                          fullWidth
                          label="Sexual Behaviors"
                          {...getFieldProps('sexualBehaviors')}
                          error={Boolean(touched.sexualBehaviors && errors.sexualBehaviors)}
                          helperText={touched.sexualBehaviors && errors.sexualBehaviors}
                        />
                        <TextField
                          fullWidth
                          label="Nutrition"
                          {...getFieldProps('nutrition')}
                          error={Boolean(touched.nutrition && errors.nutrition)}
                          helperText={touched.nutrition && errors.nutrition}
                        />
                      </Stack>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField
                          fullWidth
                          label="Colour"
                          {...getFieldProps('colour')}
                          error={Boolean(touched.colour && errors.colour)}
                          helperText={touched.colour && errors.colour}
                        />
                        <Autocomplete
                          fullWidth
                          disablePortal
                          clearIcon
                          id="Status"
                          {...getFieldProps('statusEnum')}
                          options={optionsStatus}
                          getOptionLabel={(option: any) => (option ? option.name : '')}
                          onChange={(e, value: any) =>
                            value ? { ...setFieldValue('statusEnum', value) } : ''
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Status"
                              error={Boolean(touched.statusEnum && errors.statusEnum)}
                              helperText={touched.statusEnum && errors.statusEnum}
                            />
                          )}
                        />
                      </Stack>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <Autocomplete
                          fullWidth
                          disablePortal
                          clearIcon
                          id="coralTypeId"
                          {...getFieldProps('coralTypeId')}
                          options={optionsGenus}
                          getOptionLabel={(option) => (option ? option.name : '')}
                          onChange={(e, value) => setFieldValue('coralTypeId', value)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Species name"
                              error={Boolean(touched.coralTypeId && errors.coralTypeId)}
                              helperText={touched.coralTypeId && errors.coralTypeId}
                            />
                          )}
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
                      {isEdit && (
                        <>
                          <Card>
                            <Grid container>
                              <Grid item xs={12} md={6} lg={7}>
                                <CoralDetailsCarousel coral={currentCoral} />
                              </Grid>
                              {/* <Grid item xs={12} md={6} lg={5}>
                                <CoralDetailsSummary
                                  product={product}
                                  cart={checkout.cart}
                                  onAddCart={handleAddCart}
                                  onGotoStep={handleGotoStep}
                                />
                              </Grid> */}
                            </Grid>
                          </Card>
                        </>
                      )}
                      <div>
                        <LabelStyle>Add Images</LabelStyle>
                        <UploadMultiFile
                          showPreview
                          accept="image/*"
                          files={values.imageUrl}
                          onDrop={handleDrop}
                          onRemove={handleRemove}
                          onRemoveAll={handleRemoveAll}
                          // error={Boolean(touched.imageUrl && errors.imageUrl)}
                        />
                        {/* {touched.imageUrl && errors.imageUrl && (
                      <FormHelperText error sx={{ px: 2 }}>
                        {touched.imageUrl && errors.imageUrl}
                      </FormHelperText>
                    )} */}
                      </div>

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
        </TabPanel>
        <TabPanel value="habitat">
          <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
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
                          label="Current"
                          {...getFieldProps('current')}
                          error={Boolean(touched.current && errors.current)}
                          helperText={touched.current && errors.current}
                        />
                      </Stack>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField
                          fullWidth
                          label="Tides"
                          {...getFieldProps('tides')}
                          error={Boolean(touched.tides && errors.tides)}
                          helperText={touched.tides && errors.tides}
                        />
                        {/* <TextField
                          fullWidth
                          label="Current"
                          {...getFieldProps('current')}
                          error={Boolean(touched.current && errors.current)}
                          helperText={touched.current && errors.current}
                        /> */}
                      </Stack>
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                          {!isEdit ? 'Create Habitat' : 'Save Changes'}
                        </LoadingButton>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </TabPanel>
        {/* <TabPanel value="3">Item Three</TabPanel> */}
      </TabContext>
    </Box>
  );
}
