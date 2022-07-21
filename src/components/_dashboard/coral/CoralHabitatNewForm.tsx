import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import { Card, Box, Grid, Stack, TextField, Typography } from '@material-ui/core';
// utils
import { manageCoral } from '_apis_/coral';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hook
import useLocales from '../../../hooks/useLocales';
// @types
import { Habitat } from '../../../@types/coral';

// ----------------------------------------------------------------------

type CoralHabitatNewFormProps = {
  coralId?: String;
  currentHabitat?: Habitat | null;
};

export default function CoralHabitatNewForm({ coralId, currentHabitat }: CoralHabitatNewFormProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
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
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      coralId: coralId || '',
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

        if (flag) {
          resetForm();
          setSubmitting(false);
          enqueueSnackbar(
            currentHabitat?.id == null
              ? translate('message.create-success')
              : translate('message.update-success'),
            {
              variant: 'success'
            }
          );
          navigate(PATH_DASHBOARD.coral.list);
        } else {
          enqueueSnackbar(
            currentHabitat?.id == null
              ? translate('message.create-error')
              : translate('message.update-error'),
            { variant: 'error' }
          );
        }
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

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
                    {currentHabitat?.id == null
                      ? translate('button.save.add')
                      : translate('button.save.update')}
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
