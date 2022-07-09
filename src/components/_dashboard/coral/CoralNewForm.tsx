import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { Icon } from '@iconify/react';
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
  Tab,
  ListItem,
  Paper
} from '@material-ui/core';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
// utils
import { manageCoral } from '_apis_/coral';
import { OptionStatus, coralStatusOptions } from 'utils/constants';
import { RootState, useSelector } from 'redux/store';

import PhasesTypeCreate from 'pages/dashboard/CoralPhasesType';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hook
import useLocales from '../../../hooks/useLocales';
// @types
import { Coral, Habitat } from '../../../@types/coral';
//
import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';
import LivePreview from '../../upload/LivePreview';
import PhaseDetailNewForm from './PhaseDetailNewForm';

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
  const coralTypeSpecies = useSelector((state: RootState) => state.coral.coralType);
  const [enumCoralStatus, setEnumCoralStatus] = useState<OptionStatus | null>(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [img, setImg] = useState<string[]>();

  const NewProductSchema = Yup.object().shape(
    valueTab === 'coral'
      ? {
          name: Yup.string()
            .required(translate('message.form.name'))
            .min(3, translate('message.form.name_length_200'))
            .max(200, translate('message.form.name_length_200')),
          scientificName: Yup.string()
            .required(translate('message.form.scientfic'))
            .min(3, translate('message.form.scientfic_length_200'))
            .max(200, translate('message.form.scientfic_length_200')),
          longevity: Yup.number()
            .required(translate('message.form.longevity'))
            .typeError(translate('message.form.longevity_typeError'))
            .min(1, translate('message.form.longevity_min')),
          exhibitSocial: Yup.string()
            .required(translate('message.form.exhibit_social'))
            .min(3, translate('message.form.exhibit_social_length_200'))
            .max(200, translate('message.form.exhibit_social_length_200')),
          sexualBehaviors: Yup.string()
            .required(translate('message.form.sexual_behaviors'))
            .min(3, translate('message.form.sexual_behaviors_length_200'))
            .max(200, translate('message.form.sexual_behaviors_length_200')),
          nutrition: Yup.string()
            .required(translate('message.form.nutrition'))
            .min(3, translate('message.form.nutrition_length_200'))
            .max(200, translate('message.form.nutrition_length_200')),
          colour: Yup.string()
            .required(translate('message.form.colour'))
            .min(3, translate('message.form.colour_length_200'))
            .max(50, translate('message.form.colour_length_200')),
          coralTypeId: Yup.object().required(translate('message.form.coral_type')).nullable(true),
          statusEnum: Yup.object().required(translate('message.form.status_enum')).nullable(true)
        }
      : {
          bathymetry: Yup.string()
            .required(translate('message.form.bathymetry'))
            .typeError(translate('message.form.bathymetry_typeError')),
          temperature: Yup.number()
            .required(translate('message.form.temperature'))
            .typeError(translate('message.form.temperature_typeError')),
          brightness: Yup.string()
            .required(translate('message.form.brightness'))
            .typeError(translate('message.form.brightness_typeError')),
          tides: Yup.string()
            .required(translate('message.form.tides'))
            .typeError(translate('message.form.tides_typeError')),
          current: Yup.string()
            .required(translate('message.form.current'))
            .typeError(translate('message.form.current_typeError'))
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
      coralTypeId: currentCoral?.coralTypeId || null,
      statusEnum: currentCoral?.statusEnum || '',
      habitatId: currentHabitat?.id || '',
      bathymetry: currentHabitat?.bathymetry || '',
      temperature: currentHabitat?.temperature || '',
      brightness: currentHabitat?.brightness || '',
      tides: currentHabitat?.tides || '',
      current: currentHabitat?.current || ''
    },
    validationSchema: NewProductSchema,
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
          bodyFormData.append('Longevity', values.longevity.toString());
          bodyFormData.append('ExhibitSocial', values.exhibitSocial);
          bodyFormData.append('SexualBehaviors', values.sexualBehaviors);
          bodyFormData.append('Nutrition', values.nutrition);
          bodyFormData.append('Colour', values.colour);
          bodyFormData.append('Description', values.description);
          bodyFormData.append('CoralTypeId', values.coralTypeId.id);
          bodyFormData.append('StatusEnum', values.statusEnum!.id);
          if (img) {
            img.map((file: any, index) => {
              bodyFormData.append(`Images[${index}].Id`, file.id);
              bodyFormData.append(`Images[${index}].ImageUrl`, file.imageUrl);
            });
            img.map((file: any, index) => console.log(`Images[${index}].Id`, file.id));
          }
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
          enqueueSnackbar(
            !isEdit ? translate('message.create-success') : translate('message.update-success'),
            {
              variant: 'success'
            }
          );
          navigate(PATH_DASHBOARD.coral.list);
        } else {
          enqueueSnackbar(
            !isEdit ? translate('message.create-error') : translate('message.update-error'),
            { variant: 'error' }
          );
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
      console.log(1);
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

  const handleRemoveImage = (imageId: string) => {
    if (img) {
      const filteredImage = img.filter((v: any) => v.id !== imageId);
      setImg(filteredImage);
    }
  };

  useEffect(() => {
    if (isEdit) {
      setFieldValue(
        'coralTypeId',
        coralTypeSpecies.find((v) => v.id == currentCoral?.coralTypeId)
      );
      setFieldValue(
        'statusEnum',
        coralStatusOptions.find((e) => e.id == currentCoral?.statusEnum)
      );
      setImg(currentCoral?.images);
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
            <Tab
              label={translate('page.coral.form.label.habitat')}
              value="phases"
              disabled={!isEdit}
            />
            {/* <Tab label="Item Three" value="3" /> */}
          </TabList>
        </Box>
        <TabPanel sx={{ p: 3 }} value="coral">
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
                          id="statusEnum"
                          {...getFieldProps('statusEnum')}
                          options={coralStatusOptions}
                          getOptionLabel={(option: OptionStatus) =>
                            option ? translate(`status.coral.${option.id}`) : ''
                          }
                          onChange={(e, values: any) => setFieldValue('statusEnum', values)}
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
                          id="coralTypeId"
                          {...getFieldProps('coralTypeId')}
                          options={coralTypeSpecies}
                          getOptionLabel={(option) => (option ? option.name : '')}
                          onChange={(e, value) => setFieldValue('coralTypeId', value)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={translate('page.coral.form.coral-type')}
                              error={Boolean(touched.coralTypeId && errors.coralTypeId)}
                              helperText={touched.coralTypeId && errors.coralTypeId}
                            />
                          )}
                        />
                      </Stack>

                      {img && (
                        <>
                          <LivePreview files={img} onRemove={handleRemoveImage} />
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
        <TabPanel sx={{ p: 3 }} value="habitat">
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
        <TabPanel sx={{ p: 3 }} value="phases">
          <PhaseDetailNewForm coral={currentCoral} />
          {/* <PhasesTypeCreate /> */}
        </TabPanel>
      </TabContext>
    </Box>
  );
}
