import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@material-ui/lab';
import { Card, Box, Grid, Stack, TextField, Typography, Autocomplete } from '@material-ui/core';
// utils
import { manageGarden } from '_apis_/garden';
import { OptionStatus, statusOptions } from 'utils/constants';

import { RootState, useSelector } from 'redux/store';
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
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
  const gardenTypesList = useSelector((state: RootState) => state.garden.gardenTypesList);
  const siteList = useSelector((state: RootState) => state.garden.siteList);
  const areaList = useSelector((state: RootState) => state.area.areaList);
  const NewGardenSchema = Yup.object().shape({
    name: Yup.string()
      .required(translate('message.form.name'))
      .min(3, translate('message.form.name_length_50'))
      .max(50, translate('message.form.name_length_50')),
    latitude: Yup.string().required(translate('message.form.latitude')),
    longitude: Yup.string().required(translate('message.form.longitude')),
    address: Yup.string().required(translate('message.form.address')),
    acreage: Yup.string()
      .required()
      .matches(/^[0-9]+$/, translate('message.form.acreage_typeError'))
      .required(translate('message.form.acreage')),
    quantityOfCells: Yup.string()
      .required()
      .matches(/^[0-9]+$/, translate('message.form.quantity_of_cells_typeError'))
      .required(translate('message.form.quantity_of_cells')),
    areaId: Yup.object().required(translate('message.form.area')),
    gardenTypeId: Yup.object().required(translate('message.form.garden_type')),
    siteId: Yup.object().required(translate('message.form.site'))
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentGarden?.id || '',
      name: currentGarden?.name || '',
      latitude: currentGarden?.latitude || '',
      longitude: currentGarden?.longitude || '',
      address: currentGarden?.address || '',
      acreage: currentGarden?.acreage || 0,
      quantityOfCells: currentGarden?.quantityOfCells || 0,
      areaId: currentGarden?.areaId || '',
      gardenTypeId: currentGarden?.gardenTypeId || '',
      siteId: currentGarden?.siteId || '',
      status: currentGarden?.status || ''
    },
    validationSchema: NewGardenSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let flag = false;
        values.areaId = values.areaId.id;
        values.siteId = values.siteId.id;
        values.gardenTypeId = values.gardenTypeId.id;

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
    if (isEdit) {
      setFieldValue(
        'areaId',
        areaList.find((v) => v.id == currentGarden?.areaId)
      );
      setFieldValue(
        'gardenTypeId',
        gardenTypesList.find((v) => v.id == currentGarden?.gardenTypeId)
      );
      setFieldValue(
        'siteId',
        siteList.find((v) => v.id == currentGarden?.siteId)
      );
      setEnumStatus(statusOptions.find((v) => v.id == currentGarden?.status) || null);
    }
  }, [currentGarden]);

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
                    {...getFieldProps('areaId')}
                    options={areaList}
                    getOptionLabel={(option: any) => (option ? option.name : '')}
                    onChange={(e, value: any) =>
                      value ? { ...setFieldValue('areaId', value) } : ''
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={translate('page.garden.form.area')}
                        error={Boolean(touched.areaId && errors.areaId)}
                        helperText={touched.areaId && errors.areaId}
                      />
                    )}
                  />

                  <Autocomplete
                    fullWidth
                    disablePortal
                    clearIcon
                    id="gardenTypeId"
                    {...getFieldProps('gardenTypeId')}
                    options={gardenTypesList}
                    getOptionLabel={(option: any) => (option ? option.name : '')}
                    onChange={(e, value: any) =>
                      value ? { ...setFieldValue('gardenTypeId', value) } : null
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
                    options={siteList}
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
                      getOptionLabel={(option: OptionStatus) => translate(`status.${option.label}`)}
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
