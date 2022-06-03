import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect, useRef } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { styled as styled } from '@material-ui/core/styles';
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
  CardContent
} from '@material-ui/core';
// utils
import { OptionStatus, statusOptions } from 'utils/constants';
import { managePartner } from '_apis_/partner';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hook
import useLocales from '../../../hooks/useLocales';
// @types
import { Partner } from '../../../@types/partner';
//
import { UploadAvatar } from '../../upload';
// ----------------------------------------------------------------------

type PartnerNewFormProps = {
  isEdit: boolean;
  currentPartner?: Partner | null;
};

export default function PartnerNewForm({ isEdit, currentPartner }: PartnerNewFormProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
  const [optionsPartnerType, setOptionsPartnerType] = useState([]);
  const [imageFILE, setImageFILE] = useState('');

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
    email: Yup.string().email('Email must be a valid email address').required('Email is required')
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
      partnerType: currentPartner?.partnerType || '',
      status: currentPartner?.status || ''
    },
    validationSchema: NewGardenSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let flag = false;
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

  useEffect(() => {
    managePartner.getListPartnerType(1, 100000).then((response) => {
      if (response.status == 200) {
        setOptionsPartnerType(response.data.items);
      } else {
        setOptionsPartnerType([]);
      }
    });
  }, []);
  useEffect(() => {
    setEnumStatus(statusOptions.find((e) => e.id == Number(currentPartner?.status)) || null);
  }, [currentPartner]);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* <Grid item xs={12} md={4}> */}
          {/* <Card sx={{ py: 10, px: 3 }}> */}
          {/* <Box sx={{ mb: 5 }}>
                <UploadAvatar
                  accept="image/*"
                  file={values.}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  error={Boolean(touched.imageUrl && errors.imageUrl)}
                  caption={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary'
                      }}
                    >
                      {translate('site.message.allow-type-image')}
                    </Typography>
                  }
                />
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.imageUrl && errors.imageUrl}
                </FormHelperText>
              </Box> */}
          {/* </Card>/ */}
          {/* </Grid> */}
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
                    id="partnerType"
                    {...getFieldProps('partnerType')}
                    options={optionsPartnerType}
                    getOptionLabel={(option: any) => (option ? option.name : '')}
                    onChange={(e, value: any) =>
                      value ? { ...setFieldValue('partnerType', value) } : ''
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={translate('page.partner.form.partner-type')}
                        error={Boolean(touched.partnerType && errors.partnerType)}
                        helperText={touched.partnerType && errors.partnerType}
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
                      value={enumStatus}
                      options={statusOptions}
                      getOptionLabel={(option: OptionStatus) => option.label}
                      onChange={(e, values: OptionStatus | null) => setEnumStatus(values)}
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
