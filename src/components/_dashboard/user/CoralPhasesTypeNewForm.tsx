import * as Yup from 'yup';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@material-ui/lab';
import { Box, Card, Grid, Stack, TextField } from '@material-ui/core';
// utils
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { PhasesType } from '../../../@types/user';

// ----------------------------------------------------------------------

type CoralPhasesTypeNewFormProps = {
  isEdit: boolean;
  currentPhasesType?: PhasesType;
};

export default function CoralPhasesTypeNewForm({
  isEdit,
  currentPhasesType
}: CoralPhasesTypeNewFormProps) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    minWeight: Yup.string().required('MinWeight is required'),
    maxWeight: Yup.string().required('MaxWeight is required'),
    minHigh: Yup.string().required('MinHigh is required'),
    maxHigh: Yup.string().required('MaxHigh is required'),
    timeForm: Yup.string().required('TimeForm is required'),
    timeTo: Yup.string().required('TimeTo is required'),
    coulour: Yup.string().required('Coulour is required'),
    coralID: Yup.string().required('CoralID is required'),
    phaseID: Yup.string().required('PhaseID is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      minWeight: currentPhasesType?.minWeight || '',
      maxWeight: currentPhasesType?.maxWeight || '',
      minHigh: currentPhasesType?.minHigh || '',
      maxHigh: currentPhasesType?.maxHigh || '',
      timeForm: currentPhasesType?.timeForm || '',
      timeTo: currentPhasesType?.timeTo || '',
      coulour: currentPhasesType?.coulour || '',
      coralID: currentPhasesType?.coralID || '',
      phaseID: currentPhasesType?.phaseID || ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await fakeRequest(500);
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.user.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        // setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('avatarUrl', {
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
                    label="Min Weight"
                    {...getFieldProps('minWeight')}
                    error={Boolean(touched.minWeight && errors.minWeight)}
                    helperText={touched.minWeight && errors.minWeight}
                  />
                  <TextField
                    fullWidth
                    label="Max Weight"
                    {...getFieldProps('maxWeight')}
                    error={Boolean(touched.maxWeight && errors.maxWeight)}
                    helperText={touched.maxWeight && errors.maxWeight}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Min High"
                    {...getFieldProps('minHigh')}
                    error={Boolean(touched.minHigh && errors.minHigh)}
                    helperText={touched.minHigh && errors.minHigh}
                  />
                  <TextField
                    fullWidth
                    label="Max High"
                    {...getFieldProps('maxHigh')}
                    error={Boolean(touched.maxHigh && errors.maxHigh)}
                    helperText={touched.maxHigh && errors.maxHigh}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Time From"
                    {...getFieldProps('timeForm')}
                    error={Boolean(touched.timeForm && errors.timeForm)}
                    helperText={touched.timeForm && errors.timeForm}
                  />
                  <TextField
                    fullWidth
                    label="Time To"
                    {...getFieldProps('timeTo')}
                    error={Boolean(touched.timeTo && errors.timeTo)}
                    helperText={touched.timeTo && errors.timeTo}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Colour"
                    {...getFieldProps('coulour')}
                    error={Boolean(touched.coulour && errors.coulour)}
                    helperText={touched.coulour && errors.coulour}
                  />
                  <TextField
                    fullWidth
                    label="Coral"
                    {...getFieldProps('coralID')}
                    error={Boolean(touched.coralID && errors.coralID)}
                    helperText={touched.coralID && errors.coralID}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Coral Phase"
                    multiline
                    rows={2}
                    {...getFieldProps('phaseID')}
                    error={Boolean(touched.phaseID && errors.phaseID)}
                    helperText={touched.phaseID && errors.phaseID}
                  />
                </Stack>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Type' : 'Save Changes'}
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
