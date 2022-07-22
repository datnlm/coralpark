import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@material-ui/lab';
import { Card, Box, Grid, Stack, TextField, Checkbox, FormControlLabel } from '@material-ui/core';
import { manageCategories } from '_apis_/categories';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hook
import useLocales from '../../../hooks/useLocales';
// @types

import { Categories } from '../../../@types/categories';
// ----------------------------------------------------------------------

type CategoriesNewFormProps = {
  isEdit: boolean;
  currentCategories?: Categories;
};

export default function CategoriesNewForm({ isEdit, currentCategories }: CategoriesNewFormProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
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
      id: currentCategories?.id || '',
      name: currentCategories?.name || '',
      hasQuantity: currentCategories?.hasQuantity || false
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      let flag = false;
      try {
        values.hasQuantity = checked;
        !isEdit
          ? await manageCategories.createCategories(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageCategories.updateCategories(values).then((response) => {
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
          navigate(PATH_DASHBOARD.categories.list);
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    setChecked(currentCategories?.hasQuantity ?? false);
  }, [currentCategories]);

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
                    label={translate('page.categories.form.name')}
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    }
                    label={translate('page.categories.form.hasQuantity')}
                  />
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
