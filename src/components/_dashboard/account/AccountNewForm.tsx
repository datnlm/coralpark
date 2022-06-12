import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import { Card, Box, Grid, Stack, TextField, Autocomplete } from '@material-ui/core';
// utils
import { manageAccount } from '_apis_/account';
import { OptionStatus, statusOptions } from 'utils/constants';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hook
import useLocales from '../../../hooks/useLocales';
// @types
import { User } from '../../../@types/account';

// ----------------------------------------------------------------------

type AccountNewFormProps = {
  isEdit: boolean;
  currentAccount?: User;
};

export default function GardenNewForm({ isEdit, currentAccount }: AccountNewFormProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
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
      id: currentAccount?.id || ''
    },
    validationSchema: NewGardenSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let flag = false;

        !isEdit
          ? await manageAccount.createAccount(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageAccount.updateAccount(values).then((response) => {
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
          navigate(PATH_DASHBOARD.account.list);
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

  // const handleDrop = useCallback(
  //   (acceptedFiles) => {
  //     setFieldValue(
  //       'images',
  //       acceptedFiles.map((file: File | string) =>
  //         Object.assign(file, {
  //           preview: URL.createObjectURL(file)
  //         })
  //       )
  //     );
  //   },
  //   [setFieldValue]
  // );

  // const handleRemoveAll = () => {
  //   setFieldValue('images', []);
  // };

  // const handleRemove = (file: File | string) => {
  //   const filteredItems = values.imageUrl.filter((_file: string | File) => _file !== file);
  //   setFieldValue('images', filteredItems);
  // };

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
                    label="Garden Name"
                    {...getFieldProps('name')}
                    // error={Boolean(touched.name && errors.name)}
                    // helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label="Address"
                    {...getFieldProps('address')}
                    // error={Boolean(touched.address && errors.address)}
                    // helperText={touched.address && errors.address}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
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
                          label="Status"
                          // error={Boolean(touched.status && errors.status)}
                          // helperText={touched.status && errors.status}
                        />
                      )}
                    />
                  )}
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Garden' : 'Save Changes'}
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
