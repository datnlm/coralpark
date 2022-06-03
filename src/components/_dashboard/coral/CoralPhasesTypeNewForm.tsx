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
// hook
import useLocales from '../../../hooks/useLocales';
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
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [phaseId, setPhaseId] = useState('');
  const [currentPhase, setCurrentPhase] = useState<any>(null);
  const [optionCoralPhases, setOptionCoralPhases] = useState([]);

  const NewUserSchema = Yup.object().shape({
    minWeight: Yup.string().required('MinWeight is required'),
    maxWeight: Yup.string().required('MaxWeight is required'),
    minHigh: Yup.string().required('MinHigh is required'),
    maxHigh: Yup.string().required('MaxHigh is required'),
    timeFrom: Yup.string().required('TimeForm is required'),
    timeTo: Yup.string().required('TimeTo is required'),
    colour: Yup.string().required('Colour is required'),
    coralPhase: Yup.object().required('Phase is required').nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentPhasesType?.id || '',
      minWeight: currentPhasesType?.minWeight || '',
      maxWeight: currentPhasesType?.maxWeight || '',
      minHigh: currentPhasesType?.minHigh || '',
      maxHigh: currentPhasesType?.maxHigh || '',
      timeFrom: currentPhasesType?.timeFrom || '',
      timeTo: currentPhasesType?.timeTo || '',
      colour: currentPhasesType?.colour || '',
      coralId: currentPhasesType?.coralId || '',
      coralPhase: currentPhasesType?.coralPhase || ''
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
    manageCoral.getListCoralPhases(-1, 100000).then((response) => {
      if (response.status == 200) {
        setOptionCoralPhases(response.data.items);
      } else {
        setOptionCoralPhases([]);
      }
    });
    if (currentPhasesType != null) {
      setCurrentPhase(currentPhasesType.coralPhase);
    }
  }, []);

  useEffect(() => {
    manageCoral.getListCoralPhases(-1, 10000000).then((response) => {
      if (response.status == 200) {
        setOptionCoralPhases(response.data.items);
        if (phaseId != '') {
          setCurrentPhase(response.data.items.find((v: any) => v.id == phaseId));
        }
      } else {
        setOptionCoralPhases([]);
      }
    });
    if (currentPhasesType != null) {
      setCurrentPhase(currentPhasesType.coralPhase);
    }
  }, [phaseId]);

  useEffect(() => {
    if (currentPhasesType != null) {
      setCurrentPhase(currentPhasesType.coralPhase);
    }
  }, [currentPhasesType]);

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
                id="coralPhase"
                value={currentPhase}
                options={optionCoralPhases}
                getOptionLabel={(option: any) => (option ? option.name : '')}
                onChange={(e, value: any) => {
                  setFieldValue('coralPhase', value);
                  setCurrentPhase(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={translate('page.coral-phase.form.phase')}
                    error={Boolean(touched.coralPhase && errors.coralPhase)}
                    helperText={touched.coralPhase && errors.coralPhase}
                  />
                )}
                noOptionsText={<Button onMouseDown={handleClickOpen}>No results! Click me</Button>}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <TextField
                fullWidth
                label={translate('page.coral-phase.form.min-weight')}
                {...getFieldProps('minWeight')}
                error={Boolean(touched.minWeight && errors.minWeight)}
                helperText={touched.minWeight && errors.minWeight}
              />
              <TextField
                fullWidth
                label={translate('page.coral-phase.form.max-weight')}
                {...getFieldProps('maxWeight')}
                error={Boolean(touched.maxWeight && errors.maxWeight)}
                helperText={touched.maxWeight && errors.maxWeight}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <TextField
                fullWidth
                label={translate('page.coral-phase.form.min-high')}
                {...getFieldProps('minHigh')}
                error={Boolean(touched.minHigh && errors.minHigh)}
                helperText={touched.minHigh && errors.minHigh}
              />
              <TextField
                fullWidth
                label={translate('page.coral-phase.form.max-high')}
                {...getFieldProps('maxHigh')}
                error={Boolean(touched.maxHigh && errors.maxHigh)}
                helperText={touched.maxHigh && errors.maxHigh}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <TextField
                fullWidth
                label={translate('page.coral-phase.form.time-from')}
                {...getFieldProps('timeFrom')}
                error={Boolean(touched.timeFrom && errors.timeFrom)}
                helperText={touched.timeFrom && errors.timeFrom}
              />
              <TextField
                fullWidth
                label={translate('page.coral-phase.form.time-to')}
                {...getFieldProps('timeTo')}
                error={Boolean(touched.timeTo && errors.timeTo)}
                helperText={touched.timeTo && errors.timeTo}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <TextField
                fullWidth
                label={translate('page.coral-phase.form.colour')}
                {...getFieldProps('colour')}
                error={Boolean(touched.colour && errors.colour)}
                helperText={touched.colour && errors.colour}
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
