import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { manageGroup } from '_apis_/group';
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
  InputAdornment
} from '@material-ui/core';
// utils
import { OptionStatus, statusOptions } from 'utils/constants';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hook
import useLocales from '../../../hooks/useLocales';
// @types
import { GroupMode } from '../../../@types/group';
import { UploadAvatar } from '../../upload';

// ----------------------------------------------------------------------

type GroupModeNewFormProps = {
  isEdit: boolean;
  currentGroupMode?: GroupMode;
};

export default function GroupModeNewForm({ isEdit, currentGroupMode }: GroupModeNewFormProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [imageFILE, setImageFILE] = useState('');
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
  const NewProductSchema = Yup.object().shape({
    name: Yup.string()
      .required(translate('message.form.name'))
      .min(3, translate('message.form.name_length_50'))
      .max(50, translate('message.form.name_length_50')),
    contribution: Yup.number()
      .min(0, translate('message.form.contribution_min_max'))
      .max(100, translate('message.form.contribution_min_max'))
      .required(translate('message.form.contribution'))
      .typeError(translate('message.form.contribution_typeError'))
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentGroupMode?.id || '',
      name: currentGroupMode?.name || '',
      contribution: currentGroupMode?.contribution || 0
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      let flag = false;
      try {
        !isEdit
          ? await manageGroup.createGroupMode(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageGroup.updateUpdateMode(values).then((response) => {
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
          navigate(PATH_DASHBOARD.group.list);
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

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImageFILE(file);
      if (file) {
        setFieldValue('imageUrl', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );

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
                    label={translate('page.group-mode.form.name')}
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label={translate('page.group-mode.form.contribution')}
                    {...getFieldProps('contribution')}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>
                    }}
                    error={Boolean(touched.contribution && errors.contribution)}
                    helperText={touched.contribution && errors.contribution}
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
