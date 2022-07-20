import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { manageCoral } from '_apis_/coral';
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
import { OptionStatus, coralLevelHealthOptions } from 'utils/constants';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hook
import useLocales from '../../../hooks/useLocales';
// @types
import { CoralHealth } from '../../../@types/coral';
//
import { QuillEditor } from '../../editor';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

type CoralHealthNewFromProps = {
  isEdit: boolean;
  currentHealth?: CoralHealth | null;
};

export default function CoralHealthNewFrom({ isEdit, currentHealth }: CoralHealthNewFromProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string()
      .required(translate('message.form.name'))
      .min(3, translate('message.form.name_length_50'))
      .max(50, translate('message.form.name_length_50'))
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentHealth?.id || '',
      name: currentHealth?.name || ''
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let flag = false;

        !isEdit
          ? await manageCoral.createCoralHealth(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageCoral.updateCoralHealth(values).then((response) => {
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
          navigate(PATH_DASHBOARD.coral.listHealth);
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

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    fullWidth
                    disableClearable
                    disablePortal
                    getOptionDisabled={(option: OptionStatus) => option.id == 0}
                    clearIcon
                    id="levelType"
                    disabled={isEdit}
                    value={currentLevel}
                    options={coralLevelHealthOptions}
                    getOptionLabel={
                      (option: OptionStatus) => translate(`status.coral_level_type.${option.id}`)
                      // translate(`status.coral_level_type.${option.id}`)
                    }
                    onChange={(e, values: OptionStatus | null) => setCurrentLevel(values)}
                    renderInput={(params) => (
                      <TextField {...params} label={translate('page.coral-type.form.level')} />
                    )}
                  />
                </Stack>
                {currentLevel!.id > 1 && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      clearIcon
                      disabled={isEdit}
                      id="class"
                      loading={isLoading}
                      value={currentClass}
                      options={optionsClass}
                      getOptionLabel={(option: any) => option.name}
                      onChange={(e, value: any) => {
                        setCurrentClass(value);
                        setFieldValue('class', value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={translate('page.coral-type.form.class')}
                          error={Boolean(touched.class && errors.class)}
                          helperText={touched.class && errors.class}
                        />
                      )}
                    />
                    {currentLevel!.id > 2 && (
                      <Autocomplete
                        fullWidth
                        disablePortal
                        clearIcon
                        disabled={isEdit}
                        id="order"
                        loading={isLoading}
                        value={currentOrder}
                        options={optionsOrder}
                        getOptionLabel={(option: any) => option.name}
                        onChange={(e, value: any) => {
                          setCurrentOrder(value);
                          setFieldValue('order', value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={translate('page.coral-type.form.order')}
                            error={Boolean(touched.order && errors.order)}
                            helperText={touched.order && errors.order}
                          />
                        )}
                      />
                    )}
                  </Stack>
                )} */}
                {/* {currentLevel!.id >= 1 && ( */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('page.coral-type.form.name')}
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Stack>
                {/* )} */}
                {/* <div>
                  <LabelStyle>{translate('page.coral-type.form.description')}</LabelStyle>
                  <QuillEditor
                    simple
                    id="description"
                    value={values.description}
                    onChange={(val) => setFieldValue('description', val)}
                    error={Boolean(touched.description && errors.description)}
                  />
                  {touched.description && errors.description && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {touched.description && errors.description}
                    </FormHelperText>
                  )}
                </div> */}
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
