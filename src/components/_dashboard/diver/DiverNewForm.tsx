import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { manageDiver } from '_apis_/diver';
// material
import { LoadingButton, TabContext, TabList, TabPanel } from '@material-ui/lab';
import {
  Card,
  Box,
  Grid,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  FormHelperText,
  Tab
} from '@material-ui/core';
// utils
import { OptionStatus, statusOptions } from 'utils/constants';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hook
import useLocales from '../../../hooks/useLocales';
// @types
import { Diver } from '../../../@types/diver';
import { UploadAvatar } from '../../upload';
import DiverTeamList from './DiverTeamList';

// ----------------------------------------------------------------------

type DiverNewFormProps = {
  isEdit: boolean;
  currentDiver?: Diver;
};

export default function DiverNewForm({ isEdit, currentDiver }: DiverNewFormProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [imageFILE, setImageFILE] = useState('');
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
  const [valueTab, setValueTab] = useState('0');
  const NewProductSchema = Yup.object().shape({
    name: Yup.string()
      .required(translate('message.form.name'))
      .min(3, translate('message.form.name_length_50'))
      .max(50, translate('message.form.name_length_50')),
    // username: Yup.string().required('Username is required'),
    phone: Yup.string()
      .required()
      .matches(/^[0-9]+$/, translate('message.form.phone_typeError'))
      .min(10, translate('message.form.phone_length'))
      .max(10, translate('message.form.phone_length'))
      .required(translate('message.form.phone')),
    email: Yup.string()
      .email(translate('message.form.email_invalid'))
      .required(translate('message.form.email')),
    address: Yup.string().required(translate('message.form.address'))
    // imageUrl: Yup.array().min(1, 'Images is required')
  });

  useEffect(() => {
    setEnumStatus(statusOptions.find((e) => e.id == currentDiver?.status) || null);
  }, [currentDiver]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentDiver?.id || '',
      username: currentDiver?.username || '',
      name: currentDiver?.name || '',
      phone: currentDiver?.phone || '',
      email: currentDiver?.email || '',
      address: currentDiver?.address || '',
      imageUrl: currentDiver?.imageUrl || null,
      status: currentDiver?.status || 1
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      let flag = false;
      try {
        const bodyFormData = new FormData();
        if (isEdit) {
          bodyFormData.append('id', values.id);
          values.status = enumStatus!.id;
        }
        bodyFormData.append('Name', values.name);
        bodyFormData.append('Phone', values.phone);
        bodyFormData.append('Email', values.email);
        bodyFormData.append('Address', values.address);
        bodyFormData.append('Status', values.status);
        bodyFormData.append('imageFile', imageFILE);

        !isEdit
          ? await manageDiver.createDiver(bodyFormData).then((response) => {
              if (response.status === 200) {
                flag = true;
              }
            })
          : await manageDiver.updateDiver(bodyFormData).then((response) => {
              if (response.status === 200) {
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
          navigate(PATH_DASHBOARD.staff.diverList);
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
  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValueTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={valueTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
            <Tab label={translate('page.garden.form.label.information')} value="0" />
            <Tab label={translate('page.diver-team.heading3')} value="1" disabled={!isEdit} />
          </TabList>
        </Box>
        <TabPanel sx={{ p: 3 }} value="0">
          <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ py: 10, px: 3 }}>
                    <Box sx={{ mb: 5 }}>
                      <UploadAvatar
                        accept="image/*"
                        file={values.imageUrl}
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
                            {translate('message.allow-type-image')}
                          </Typography>
                        }
                      />
                      <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                        {touched.imageUrl && errors.imageUrl}
                      </FormHelperText>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField
                          fullWidth
                          label={translate('page.diver.form.name')}
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                        <TextField
                          fullWidth
                          label={translate('page.diver.form.phone')}
                          {...getFieldProps('phone')}
                          error={Boolean(touched.phone && errors.phone)}
                          helperText={touched.phone && errors.phone}
                        />
                      </Stack>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField
                          fullWidth
                          label={translate('page.diver.form.email')}
                          {...getFieldProps('email')}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                        <TextField
                          fullWidth
                          label={translate('page.diver.form.address')}
                          {...getFieldProps('address')}
                          error={Boolean(touched.address && errors.address)}
                          helperText={touched.address && errors.address}
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
                            getOptionLabel={(option: OptionStatus) =>
                              translate(`status.${option.label}`)
                            }
                            // getOptionLabel={(option: any) => (option ? option.name : '')}
                            onChange={(e, values: OptionStatus | null) => setEnumStatus(values)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={translate('page.diver.form.status')}
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
        </TabPanel>
        <TabPanel sx={{ p: 3 }} value="1">
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Grid item xs={12} md={12}>
                <Stack spacing={5}>
                  <DiverTeamList diverId={currentDiver?.id} />
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
