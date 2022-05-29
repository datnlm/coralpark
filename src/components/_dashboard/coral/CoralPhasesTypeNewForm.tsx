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
  Container,
  Button
} from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { PhasesType } from '../../../@types/coral';
import CreatePhaseNewFormDialog from './CreatePhaseNewFormDialog';

// ----------------------------------------------------------------------

type CoralPhasesTypeNewFormProps = {
  isEdit: boolean;
  currentPhasesType?: PhasesType;
  onSubmit: any;
  submitRef: any;
};

export default function CoralPhasesTypeNewForm({
  isEdit,
  currentPhasesType,
  onSubmit,
  submitRef
}: CoralPhasesTypeNewFormProps) {
  // Then inside the component body
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [phaseId, setPhaseId] = useState('');
  const [optionCoralPhases, setOptionCoralPhases] = useState([]);

  const NewUserSchema = Yup.object().shape({
    minWeight: Yup.string().required('MinWeight is required'),
    maxWeight: Yup.string().required('MaxWeight is required'),
    minHigh: Yup.string().required('MinHigh is required'),
    maxHigh: Yup.string().required('MaxHigh is required'),
    timeForm: Yup.string().required('TimeForm is required'),
    timeTo: Yup.string().required('TimeTo is required'),
    coulour: Yup.string().required('Coulour is required'),
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
    onSubmit: async (values) => {
      onSubmit(values);
    }
  });

  const {
    errors,
    values,
    touched,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    getFieldProps,
    setSubmitting
  } = formik;

  const handleClose = (params: string) => {
    setPhaseId(params);
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
    console.log(open);
  };

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
    manageCoral.getListCoralPhases().then((response) => {
      if (response.status == 200) {
        setOptionCoralPhases(response.data.items);
        if (phaseId != '') {
          setFieldValue(
            'phaseID',
            optionCoralPhases.find((e: any) => e.id == phaseId)
          );
        }
      } else {
        setOptionCoralPhases([]);
      }
    });
  }, [handleClose]);

  return (
    <FormikProvider value={formik}>
      <Form id="1" noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <Autocomplete
                fullWidth
                disablePortal
                clearIcon
                id="phase"
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
                noOptionsText={<Button onMouseDown={handleClickOpen}>No results! Click me</Button>}
              />
            </Stack>
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
            </Stack>
            <LoadingButton ref={submitRef} type="submit" loading={isSubmitting} />
          </Stack>
        </Card>
        <CreatePhaseNewFormDialog open={open} onClose={handleClose} />
      </Form>
    </FormikProvider>
  );
}
