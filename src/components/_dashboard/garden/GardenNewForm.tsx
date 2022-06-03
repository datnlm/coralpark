import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import { Card, Box, Grid, Stack, TextField, Typography, Autocomplete } from '@material-ui/core';
// utils
import { manageArea } from '_apis_/area';
import { manageGarden } from '_apis_/garden';
import { OptionStatus, statusOptions } from 'utils/constants';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hook
import useLocales from '../../../hooks/useLocales';
// @types
import { Garden } from '../../../@types/garden';

// ----------------------------------------------------------------------

type GardenNewFormProps = {
  isEdit: boolean;
  currentGarden?: Garden;
};

export default function GardenNewForm({ isEdit, currentGarden }: GardenNewFormProps) {
  const { translate } = useLocales();
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
    // acreage: Yup.number().min(1, 'Acreage must be greater than 0').required('Acreage is required'),
    acreage: Yup.string()
      .required()
      .matches(/^[0-9]+$/, 'Acreage must be only number')
      .required('Acreage is required'),
    quantityOfCells: Yup.string()
      .required()
      .matches(/^[0-9]+$/, 'Quantity of Cells must be only number')
      .required('Quantity of Cells is required'),
    areaID: Yup.object().required('Area is required').nullable(true),
    gardenTypeId: Yup.object().required('Garden Type is required').nullable(true),
    siteId: Yup.object().required('Garden Type is required').nullable(true)
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
      status: currentGarden?.status || ''
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
          enqueueSnackbar(
            !isEdit ? translate('message.create-success') : translate('message.update-success'),
            {
              variant: 'success'
            }
          );
          navigate(PATH_DASHBOARD.garden.list);
        } else {
          enqueueSnackbar(
            !isEdit ? translate('message.create-error') : translate('message.create-error'),
            { variant: 'error' }
          );
        }
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  useEffect(() => {
    setEnumStatus(statusOptions.find((e) => e.id == currentGarden?.status) || null);
  }, [currentGarden]);

  useEffect(() => {
    manageGarden.getListGardenType(1, 100000).then((response) => {
      if (response.status == 200) {
        setOptionsGardenType(response.data.items);
      } else {
        setOptionsGardenType([]);
      }
    });

    manageArea.getListArea(1, 1000000).then((response) => {
      if (response.status == 200) {
        setOptionsArea(response.data.items);
        // setFieldValue('areaID', { id: 1, wellKnownText: 'string', address: 'string' });
      } else {
        setOptionsArea([]);
      }
    });

    manageGarden.getListSites(1, 100000).then((response) => {
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
                    label={translate('page.garden.form.name')}
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label={translate('page.garden.form.address')}
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('page.garden.form.longitude')}
                    {...getFieldProps('longitude')}
                    error={Boolean(touched.longitude && errors.longitude)}
                    helperText={touched.longitude && errors.longitude}
                  />
                  <TextField
                    fullWidth
                    label={translate('page.garden.form.latitude')}
                    {...getFieldProps('latitude')}
                    error={Boolean(touched.latitude && errors.latitude)}
                    helperText={touched.latitude && errors.latitude}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('page.garden.form.acreage')}
                    {...getFieldProps('acreage')}
                    error={Boolean(touched.acreage && errors.acreage)}
                    helperText={touched.acreage && errors.acreage}
                  />
                  <TextField
                    fullWidth
                    label={translate('page.garden.form.quantity-of-cells')}
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
                    id="areaId"
                    {...getFieldProps('areaID')}
                    options={optionsArea}
                    getOptionLabel={(option: any) => (option ? option.address : '')}
                    onChange={(e, value: any) =>
                      value ? { ...setFieldValue('areaID', value) } : ''
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={translate('page.garden.form.area')}
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
                        label={translate('page.garden.form.garden-type')}
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
                        label={translate('page.garden.form.site')}
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
                          label={translate('page.garden.form.status')}
                          error={Boolean(touched.status && errors.status)}
                          helperText={touched.status && errors.status}
                        />
                      )}
                    />
                  )}
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
  );
}
