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
  Grid,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  FormHelperText,
  Tab
} from '@material-ui/core';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
// utils
import { manageCoral } from '_apis_/coral';
import { OptionStatus, coralStatusOptions } from 'utils/constants';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hook
import useLocales from '../../../hooks/useLocales';
// @types
import { Coral, Habitat } from '../../../@types/coral';
//
import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';
import CoralDetailsCarousel from './CoralDetailsCarousel';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));
// ----------------------------------------------------------------------

type UserNewFormProps = {
  isEdit: boolean;
  currentCoral?: Coral;
  currentHabitat?: Habitat | null;
};

export default function UserNewForm({ isEdit, currentCoral, currentHabitat }: UserNewFormProps) {
  const { translate } = useLocales();
  const [valueTab, setValueTab] = useState('coral');
  const [optionsGenus, setOptionsGenus] = useState([]);
  const [enumCoralStatus, setEnumCoralStatus] = useState<OptionStatus | null>(null);
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
      coralId: currentCoral?.id || '',
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
      coralType: currentCoral?.coralType || null,
      statusEnum: currentCoral?.statusEnum || null,
      habitatId: currentHabitat?.id || '',
      bathymetry: currentHabitat?.bathymetry || '',
      temperature: currentHabitat?.temperature || '',
      brightness: currentHabitat?.brightness || '',
      tides: currentHabitat?.tides || '',
      current: currentHabitat?.current || ''
    },
    // validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let flag = false;
        if (valueTab === 'coral') {
          const bodyFormData = new FormData();
          if (isEdit) {
            bodyFormData.append('Id', values.coralId);
          }
          bodyFormData.append('Name', values.name);
          bodyFormData.append('ScientificName', values.scientificName);
          bodyFormData.append('Longevity', values.longevity);
          bodyFormData.append('ExhibitSocial', values.exhibitSocial);
          bodyFormData.append('SexualBehaviors', values.sexualBehaviors);
          bodyFormData.append('Nutrition', values.nutrition);
          bodyFormData.append('Colour', values.colour);
          bodyFormData.append('Description', values.description);
          bodyFormData.append('CoralType.Id', values.coralType.id);
          bodyFormData.append('StatusEnum', enumCoralStatus!.id);
          values.imageUrl.map((file: File | string) => bodyFormData.append('imageFiles', file));
          !isEdit
            ? await manageCoral.createCoral(bodyFormData).then((response) => {
                if (response.status == 200) {
                  flag = true;
                }
              })
            : await manageCoral.updateCoral(bodyFormData).then((response) => {
                if (response.status == 200) {
                  flag = true;
                }
              });
        } else {
          currentHabitat?.id == null
            ? await manageCoral.createHabitat(values).then((response) => {
                if (response.status == 200) {
                  flag = true;
                }
              })
            : await manageCoral.updateHabitat(values).then((response) => {
                if (response.status == 200) {
                  flag = true;
                }
              });
        }
        if (flag) {
          resetForm();
          setSubmitting(false);
          enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', {
            variant: 'success'
          });
          navigate(PATH_DASHBOARD.coral.list);
        } else {
          enqueueSnackbar(!isEdit ? 'Create error' : 'Update error', { variant: 'error' });
        }
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
  useEffect(() => {
    if (isEdit) {
      setEnumCoralStatus(coralStatusOptions.find((e) => e.id == currentCoral?.statusEnum) || null);
    }
  }, [currentCoral]);

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={valueTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
            <Tab label={translate('page.coral.form.label.coral')} value="coral" />
            <Tab
              label={translate('page.coral.form.label.habitat')}
              value="habitat"
              disabled={!isEdit}
            />
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
                          label={translate('page.coral.form.name')}
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                        <TextField
                          fullWidth
                          label={translate('page.coral.form.scientific')}
                          {...getFieldProps('scientificName')}
                          error={Boolean(touched.scientificName && errors.scientificName)}
                          helperText={touched.scientificName && errors.scientificName}
                        />
                      </Stack>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField
                          fullWidth
                          label={translate('page.coral.form.longevity')}
                          {...getFieldProps('longevity')}
                          error={Boolean(touched.longevity && errors.longevity)}
                          helperText={touched.longevity && errors.longevity}
                        />
                        <TextField
                          fullWidth
                          label={translate('page.coral.form.exhibit-social')}
                          {...getFieldProps('exhibitSocial')}
                          error={Boolean(touched.exhibitSocial && errors.exhibitSocial)}
                          helperText={touched.exhibitSocial && errors.exhibitSocial}
                        />
                      </Stack>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField
                          fullWidth
                          label={translate('page.coral.form.sexual-behaviors')}
                          {...getFieldProps('sexualBehaviors')}
                          error={Boolean(touched.sexualBehaviors && errors.sexualBehaviors)}
                          helperText={touched.sexualBehaviors && errors.sexualBehaviors}
                        />
                        <TextField
                          fullWidth
                          label={translate('page.coral.form.nutrition')}
                          {...getFieldProps('nutrition')}
                          error={Boolean(touched.nutrition && errors.nutrition)}
                          helperText={touched.nutrition && errors.nutrition}
                        />
                      </Stack>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField
                          fullWidth
                          label={translate('page.coral.form.colour')}
                          {...getFieldProps('colour')}
                          error={Boolean(touched.colour && errors.colour)}
                          helperText={touched.colour && errors.colour}
                        />
                        <Autocomplete
                          fullWidth
                          disablePortal
                          clearIcon
                          id="status"
                          value={enumCoralStatus}
                          options={coralStatusOptions}
                          getOptionLabel={(option: OptionStatus) => option.label}
                          onChange={(e, values: OptionStatus | null) => setEnumCoralStatus(values)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={translate('page.coral.form.status-enum')}
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
                          id="coralType"
                          {...getFieldProps('coralType')}
                          options={optionsGenus}
                          getOptionLabel={(option) => (option ? option.name : '')}
                          onChange={(e, value) => setFieldValue('coralType', value)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={translate('page.coral.form.coral-type')}
                              error={Boolean(touched.coralType && errors.coralType)}
                              helperText={touched.coralType && errors.coralType}
                            />
                          )}
                        />
                      </Stack>
                      <div>
                        <LabelStyle>{translate('page.coral.form.description')}</LabelStyle>
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
                      {currentCoral?.images && (
                        <>
                          <Card>
                            <Grid container>
                              <Grid item xs={12} md={6} lg={7}>
                                <CoralDetailsCarousel coral={currentCoral} />
                              </Grid>
                            </Grid>
                          </Card>
                        </>
                      )}
                      <div>
                        <LabelStyle>{translate('page.coral.form.image')}</LabelStyle>
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
                          {!isEdit ? translate('button.save.add') : translate('button.save.update')}
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
                          label={translate('page.coral-habitat.form.bathymetry')}
                          {...getFieldProps('bathymetry')}
                          error={Boolean(touched.bathymetry && errors.bathymetry)}
                          helperText={touched.bathymetry && errors.bathymetry}
                        />
                        <TextField
                          fullWidth
                          label={translate('page.coral-habitat.form.temperature')}
                          {...getFieldProps('temperature')}
                          error={Boolean(touched.temperature && errors.temperature)}
                          helperText={touched.temperature && errors.temperature}
                        />
                      </Stack>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField
                          fullWidth
                          label={translate('page.coral-habitat.form.brightness')}
                          {...getFieldProps('brightness')}
                          error={Boolean(touched.brightness && errors.brightness)}
                          helperText={touched.brightness && errors.brightness}
                        />
                        <TextField
                          fullWidth
                          label={translate('page.coral-habitat.form.current')}
                          {...getFieldProps('current')}
                          error={Boolean(touched.current && errors.current)}
                          helperText={touched.current && errors.current}
                        />
                      </Stack>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField
                          fullWidth
                          label={translate('page.coral-habitat.form.tides')}
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
                          {!isEdit ? translate('button.save.add') : translate('button.save.update')}
                        </LoadingButton>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
