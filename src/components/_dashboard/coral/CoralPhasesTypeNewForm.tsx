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
  Button,
  InputAdornment
} from '@material-ui/core';
// routes
import { RootState, useSelector } from 'redux/store';
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
  let phaseId = '';
  const listPhase = useSelector((state: RootState) => state.coral.coralPhaseList);

  const NewUserSchema = Yup.object().shape({
    minWeight: Yup.number()
      .required(translate('message.form.min_weight'))
      .min(0, translate('message.form.min_weight_min'))
      .typeError(translate('message.form.min_typeError')),
    maxWeight: Yup.number()
      .required(translate('message.form.max_weight'))
      .min(0, translate('message.form.max_weight_min'))
      .typeError(translate('message.form.max_weight_typeError')),
    minHigh: Yup.number()
      .required(translate('message.form.min_high'))
      .min(0, translate('message.form.min_high_min'))
      .typeError(translate('message.form.min_high_typeError')),
    maxHigh: Yup.number()
      .required(translate('message.form.max_high'))
      .min(0, translate('message.form.max_high_min'))
      .typeError(translate('message.form.max_high_typeError')),
    timeFrom: Yup.number()
      .required(translate('message.form.time_from'))
      .min(0, translate('message.form.time_from_min'))
      .typeError(translate('message.form.time_from_typeError')),
    timeTo: Yup.number()
      .required(translate('message.form.time_fo'))
      .min(0, translate('message.form.time_fo_min'))
      .typeError(translate('message.form.time_to_typeError')),
    colour: Yup.string().required(translate('message.form.colour')),
    coralPhaseId: Yup.object().required(translate('message.form.coral_phase')).nullable(true)
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
      coralPhaseId: currentPhasesType?.coralPhaseId || ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values) => {
      values.coralPhaseId = values.coralPhaseId.id;
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
    phaseId = params;
    // setPhaseId(params);
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (currentPhasesType != null && currentPhasesType.coralPhaseId != '') {
      setFieldValue(
        'coralPhaseId',
        listPhase.find((v) => v.id == currentPhasesType.coralPhaseId)
      );
    } else if (phaseId) {
      setFieldValue(
        'coralPhaseId',
        listPhase.find((v) => v.id == phaseId)
      );
    }
  }, [currentPhasesType, listPhase]);

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
                {...getFieldProps('coralPhaseId')}
                options={listPhase}
                getOptionLabel={(option: any) => (option ? option.name : '')}
                onChange={(e, value: any) => setFieldValue('coralPhaseId', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={translate('page.coral-phase.form.phase')}
                    error={Boolean(touched.coralPhaseId && errors.coralPhaseId)}
                    helperText={touched.coralPhaseId && errors.coralPhaseId}
                  />
                )}
                noOptionsText={
                  <Button onMouseDown={handleClickOpen}> {translate('button.save.add')}</Button>
                }
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <TextField
                fullWidth
                label={translate('page.coral-phase.form.min-weight')}
                {...getFieldProps('minWeight')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">gram</InputAdornment>
                }}
                error={Boolean(touched.minWeight && errors.minWeight)}
                helperText={touched.minWeight && errors.minWeight}
              />
              <TextField
                fullWidth
                label={translate('page.coral-phase.form.max-weight')}
                {...getFieldProps('maxWeight')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">gram</InputAdornment>
                }}
                error={Boolean(touched.maxWeight && errors.maxWeight)}
                helperText={touched.maxWeight && errors.maxWeight}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <TextField
                fullWidth
                label={translate('page.coral-phase.form.min-high')}
                {...getFieldProps('minHigh')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>
                }}
                error={Boolean(touched.minHigh && errors.minHigh)}
                helperText={touched.minHigh && errors.minHigh}
              />
              <TextField
                fullWidth
                label={translate('page.coral-phase.form.max-high')}
                {...getFieldProps('maxHigh')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>
                }}
                error={Boolean(touched.maxHigh && errors.maxHigh)}
                helperText={touched.maxHigh && errors.maxHigh}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <TextField
                fullWidth
                label={translate('page.coral-phase.form.time-from')}
                {...getFieldProps('timeFrom')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {translate('page.coral-phase.form.year')}
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.timeFrom && errors.timeFrom)}
                helperText={touched.timeFrom && errors.timeFrom}
              />
              <TextField
                fullWidth
                label={translate('page.coral-phase.form.time-to')}
                {...getFieldProps('timeTo')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {translate('page.coral-phase.form.year')}
                    </InputAdornment>
                  )
                }}
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
