import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, Fragment } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { LoadingButton } from '@material-ui/lab';
import {
  Card,
  Box,
  Grid,
  Stack,
  TextField,
  Autocomplete,
  CircularProgress
} from '@material-ui/core';
// utils
import { OptionStatus, statusOptions } from 'utils/constants';
import { managePartner } from '_apis_/partner';

import { RootState, useSelector } from 'redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hook
import useLocales from '../../../hooks/useLocales';
// @types
import { Partner, PartnerType } from '../../../@types/partner';
// ----------------------------------------------------------------------

type PartnerNewFormProps = {
  isEdit: boolean;
  currentPartner?: Partner | null;
};

export default function PartnerNewForm({ isEdit, currentPartner }: PartnerNewFormProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const partnerTypeList = useSelector((state: RootState) => state.partner.partnerTypeList);
  // const isLoading = useSelector((state: RootState) => state.partner.isLoading);
  // const [open, setOpen] = useState(false);

  const NewGardenSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phone: Yup.string()
      .required()
      .matches(/^[0-9]+$/, 'Phone must be only number')
      .min(10, 'Phone must be 10 number')
      .max(10, 'Phone must be 10 number')
      .required('Phone is required'),
    address: Yup.string().required('Address is required'),
    webUrl: Yup.string().matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Enter correct url!'
    ),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    partnerTypeId: Yup.object().required('Partner Type is required')
    // status: Yup.object().required('Status is required').nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentPartner?.id || '',
      name: currentPartner?.name || '',
      phone: currentPartner?.phone || '',
      email: currentPartner?.email || '',
      address: currentPartner?.address || '',
      webUrl: currentPartner?.webUrl || '',
      partnerTypeId: currentPartner?.partnerTypeId || '',
      status: currentPartner?.status || ''
    },
    validationSchema: NewGardenSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let flag = false;
        if (isEdit) {
          values.status = values.status.id;
        }
        values.partnerTypeId = values.partnerTypeId.id;
        !isEdit
          ? await managePartner.createPartner(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await managePartner.updatePartner(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            });
        if (flag) {
          resetForm();
          setSubmitting(false);
          enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', {
            variant: 'success'
          });
          navigate(PATH_DASHBOARD.partner.list);
        } else {
          enqueueSnackbar(!isEdit ? 'Create error' : 'Update error', { variant: 'error' });
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
        'partnerTypeId',
        partnerTypeList.find((v) => v.id == currentPartner?.partnerTypeId)
      );
      setFieldValue(
        'status',
        statusOptions.find((v: OptionStatus) => v.id == currentPartner?.status)
      );
    }
  }, [currentPartner]);

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
                    label={translate('page.partner.form.name')}
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label={translate('page.partner.form.phone')}
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('page.partner.form.email')}
                    type="email"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <TextField
                    fullWidth
                    label={translate('page.partner.form.address')}
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('page.partner.form.website')}
                    {...getFieldProps('webUrl')}
                    error={Boolean(touched.webUrl && errors.webUrl)}
                    helperText={touched.webUrl && errors.webUrl}
                  />
                  <Autocomplete
                    fullWidth
                    disablePortal
                    clearIcon
                    id="partnerTypeId"
                    // open={open}
                    // onOpen={() => {
                    //   setOpen(true);
                    // }}
                    // onClose={() => {
                    //   setOpen(false);
                    // }}
                    // loading={isLoading}
                    // loading={isLoading && open}
                    {...getFieldProps('partnerTypeId')}
                    options={partnerTypeList}
                    getOptionLabel={(option: any) => (option ? option.name : '')}
                    onChange={(e, value: any) =>
                      value ? { ...setFieldValue('partnerTypeId', value) } : null
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={translate('page.partner.form.partner-type')}
                        // InputProps={{
                        //   ...params.InputProps,
                        //   endAdornment: (
                        //     <>
                        //       {isLoading && open ? (
                        //         <CircularProgress color="inherit" size={20} />
                        //       ) : null}
                        //       {params.InputProps.endAdornment}
                        //     </>
                        //   )
                        // }}
                        error={Boolean(touched.partnerTypeId && errors.partnerTypeId)}
                        helperText={touched.partnerTypeId && errors.partnerTypeId}
                      />
                    )}
                  />
                </Stack>
                {isEdit && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      clearIcon
                      id="status"
                      {...getFieldProps('status')}
                      options={statusOptions}
                      getOptionLabel={(option: OptionStatus) => (option ? option.label : '')}
                      onChange={(e, value: any) =>
                        value ? { ...setFieldValue('status', value) } : ''
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={translate('page.partner.form.status')}
                          error={Boolean(touched.status && errors.status)}
                          helperText={touched.status && errors.status}
                        />
                      )}
                    />
                  </Stack>
                )}
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
