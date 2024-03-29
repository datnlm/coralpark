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
import { RootState, useSelector, useDispatch } from 'redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hook
import useLocales from '../../../hooks/useLocales';
// @types
import { GroupRole } from '../../../@types/group';
import { UploadAvatar } from '../../upload';

// ----------------------------------------------------------------------

type GroupRoleNewFormProps = {
  isEdit: boolean;
  currentGroupRole?: GroupRole;
};

export default function GroupRoleNewForm({ isEdit, currentGroupRole }: GroupRoleNewFormProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const groupModeList = useSelector((state: RootState) => state.groupMode.groupModeList);
  const NewProductSchema = Yup.object().shape({
    name: Yup.string()
      .required(translate('message.form.name'))
      .min(3, translate('message.form.name_length_50'))
      .max(50, translate('message.form.name_length_50')),
    personalRate: Yup.number()
      .min(0, translate('message.form.personal_rate_min_max'))
      .max(100, translate('message.form.personal_rate_min_max'))
      .required(translate('message.form.personal_rate'))
      .typeError(translate('message.form.personal_rate_typeError')),
    partnerRate: Yup.number()
      .min(0, translate('message.form.partner_rate_min_max'))
      .max(100, translate('message.form.partner_rate_min_max'))
      .required(translate('message.form.partner_rate'))
      .typeError(translate('message.form.partner_rate_typeError'))
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentGroupRole?.id || '',
      name: currentGroupRole?.name || '',
      personalRate: currentGroupRole?.personalRate || 0,
      partnerRate: currentGroupRole?.partnerRate || 0,
      groupModeId: currentGroupRole?.groupModeId || ''
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      let flag = false;
      try {
        values.groupModeId = values.groupModeId.id;
        !isEdit
          ? await manageGroup.createGroupRole(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageGroup.updateUpdateRole(values).then((response) => {
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
          navigate(PATH_DASHBOARD.group.listRole);
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
        'groupModeId',
        groupModeList.find((v) => v.id == currentGroupRole?.groupModeId)
      );
    }
  }, [currentGroupRole]);

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
                    label={translate('page.group-role.form.name')}
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <Autocomplete
                    fullWidth
                    disablePortal
                    clearIcon
                    id="groupModeId"
                    {...getFieldProps('groupModeId')}
                    options={groupModeList}
                    getOptionLabel={(option: any) => (option ? option.name : '')}
                    onChange={(e, value: any) =>
                      value ? { ...setFieldValue('groupModeId', value) } : ''
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={translate('page.group-role.form.groupModeId')}
                        error={Boolean(touched.groupModeId && errors.groupModeId)}
                        helperText={touched.groupModeId && errors.groupModeId}
                      />
                    )}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('page.group-role.form.personalRate')}
                    {...getFieldProps('personalRate')}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>
                    }}
                    error={Boolean(touched.personalRate && errors.personalRate)}
                    helperText={touched.personalRate && errors.personalRate}
                  />
                  <TextField
                    fullWidth
                    label={translate('page.group-role.form.partnerRate')}
                    {...getFieldProps('partnerRate')}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>
                    }}
                    error={Boolean(touched.partnerRate && errors.partnerRate)}
                    helperText={touched.partnerRate && errors.partnerRate}
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
