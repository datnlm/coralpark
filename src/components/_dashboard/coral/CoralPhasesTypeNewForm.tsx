import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { manageCoral } from '_apis_/coral';
// material
import { LoadingButton } from '@material-ui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  TextField,
  Autocomplete,
  Paper,
  Container
} from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { PhasesType } from '../../../@types/coral';

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
  const [optionCoral, setOptionCoral] = useState([]);
  const [optionCoralPhases, setOptionCoralPhases] = useState([]);

  const NewUserSchema = Yup.object().shape({
    minWeight: Yup.string().required('MinWeight is required'),
    maxWeight: Yup.string().required('MaxWeight is required'),
    minHigh: Yup.string().required('MinHigh is required'),
    maxHigh: Yup.string().required('MaxHigh is required'),
    timeForm: Yup.string().required('TimeForm is required'),
    timeTo: Yup.string().required('TimeTo is required'),
    coulour: Yup.string().required('Coulour is required'),
    coralID: Yup.object().required('CoralID is required').nullable(true),
    phaseID: Yup.object().required('PhaseID is required').nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentPhasesType?.id || '',
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
        let flag = false;
        !isEdit
          ? await manageCoral.createCoralPhasesType(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageCoral.updateCoralPhasesType(values).then((response) => {
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
          navigate(PATH_DASHBOARD.phases.typeNew);
        } else {
          enqueueSnackbar(!isEdit ? 'Create error' : 'Update error', { variant: 'error' });
        }
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

  useEffect(() => {
    manageCoral.getListCoral().then((response) => {
      if (response.status == 200) {
        setOptionCoral(response.data.items);
      } else {
        setOptionCoral([]);
      }
    });
    manageCoral.getListCoralPhases().then((response) => {
      if (response.status == 200) {
        setOptionCoralPhases(response.data.items);
      } else {
        setOptionCoralPhases([]);
      }
    });
  }, []);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
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
              <Autocomplete
                fullWidth
                disablePortal
                clearIcon
                id="coral"
                {...getFieldProps('coralID')}
                options={optionCoral}
                getOptionLabel={(option: any) => (option ? option.name : '')}
                onChange={(e, value: any) => (value ? { ...setFieldValue('coralID', value) } : '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Coral"
                    error={Boolean(touched.coralID && errors.coralID)}
                    helperText={touched.coralID && errors.coralID}
                  />
                )}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <Autocomplete
                fullWidth
                disablePortal
                clearIcon
                id="coral"
                {...getFieldProps('phaseID')}
                options={optionCoralPhases}
                getOptionLabel={(option: any) => (option ? option.name : '')}
                onChange={(e, value: any) => (value ? { ...setFieldValue('phaseID', value) } : '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Phases"
                    error={Boolean(touched.phaseID && errors.phaseID)}
                    helperText={touched.phaseID && errors.phaseID}
                  />
                )}
              />
            </Stack>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Type' : 'Save Changes'}
              </LoadingButton>
            </Box>
          </Stack>
        </Card>
      </Form>
    </FormikProvider>
  );
}
