import { useState, useRef, useEffect } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
// material
import {
  Box,
  Step,
  Paper,
  Button,
  Stepper,
  StepLabel,
  Typography,
  IconButton,
  Stack,
  TextField,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CoralPhasesTypeNewForm from 'components/_dashboard/coral/CoralPhasesTypeNewForm';
import { manageCoral } from '_apis_/coral';
import { RootState, useSelector } from 'redux/store';
import { Coral, PhasesType } from '../../../@types/coral';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import useLocales from '../../../hooks/useLocales';

// ----------------------------------------------------------------------
const phase: PhasesType = {
  id: '',
  minWeight: 0,
  maxWeight: 0,
  minHigh: 0,
  maxHigh: 0,
  timeFrom: 0,
  timeTo: 0,
  colour: '',
  coralId: '',
  coralPhaseId: ''
};

export type OptionStatus = {
  id: any;
  label: string;
};

// const steps = ['Phase 1'];
type PhaseDetailNewFormProps = {
  coral?: Coral;
};
export default function PhaseDetailNewForm({ coral }: PhaseDetailNewFormProps) {
  const { translate } = useLocales();
  const [isEdit, setIsEdit] = useState<Boolean>(false);
  const listPhase = useSelector((state: RootState) => state.coral.coralPhaseList);
  const isLoading = useSelector((state: RootState) => state.coral.isLoading);
  const [open, setOpen] = useState(false);
  const callback = async (params: PhasesType) => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    const dt = data;
    dt[activeStep] = params;
    setData(dt);
    if (activeStep === steps.length - 1) {
      try {
        const formPhase = {
          id: coral!.id,
          colour: coral!.colour,
          exhibitSocial: coral!.exhibitSocial,
          longevity: coral!.longevity,
          name: coral!.name,
          nutrition: coral!.nutrition,
          scientificName: coral!.scientificName,
          sexualBehaviors: coral!.sexualBehaviors,
          coralTypeId: coral!.coralTypeId,
          coralPhaseTypes: data
        };
        let flag = false;
        !isEdit
          ? await manageCoral.createCoralPhasesType(formPhase).then((response) => {
              if (response.status === 200) {
                flag = true;
              }
            })
          : await manageCoral.updateCoralPhasesType(formPhase).then((response) => {
              if (response.status === 200) {
                flag = true;
              }
            });
        if (flag) {
          // resetForm();
          // setSubmitting(false);
          enqueueSnackbar(
            !isEdit ? translate('message.create-success') : translate('message.update-success'),
            {
              variant: 'success'
            }
          );
          navigate(PATH_DASHBOARD.coral.list);
        } else {
          console.log('update error');
          enqueueSnackbar(
            !isEdit ? translate('message.create-error') : translate('message.update-error'),
            { variant: 'error' }
          );
        }
      } catch (error) {
        console.log(error);
        // console.error(error);
        // setSubmitting(false);
        // setErrors(error);
      }
    }
  };
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [steps, setSteps] = useState(['']);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [data, setData] = useState<PhasesType[]>([phase]);
  const submitRef = useRef<HTMLInputElement>(null);
  // const [coral, setCoral] = useState<any>(null);

  const isStepOptional = (step: number) => step === 1;

  const isStepSkipped = (step: number) => skipped.has(step);

  const handleNext = async () => {
    // call api
    if (submitRef && submitRef.current) {
      submitRef.current?.click();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSteps(['']);
    setData([phase]);
  };

  const handleDelete = () => {
    console.log(activeStep);
    const dataTmp = data;
    const stepTmp = steps;

    dataTmp.splice(activeStep, 1);
    stepTmp.splice(activeStep, 1);
    setData(dataTmp);
    setSteps(stepTmp);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };
  const handleAddMore = () => {
    const s = steps;
    const dt = data;
    dt.push(phase);
    setData(dt);
    s.push('');
    setSteps(s);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (coral != null) {
      manageCoral.getCoralByID(coral.id).then((response) => {
        if (response.status == 200) {
          const phaseType = response.data.coralPhaseTypes;
          if (phaseType.length) {
            setData(phaseType);
            const s: any[] = [];
            let flag = false;
            phaseType.map((v: any) => {
              if (v.coralPhaseId != null) {
                setIsEdit(true);
                s.push(listPhase.find((value) => value.id == v.coralPhaseId)?.name);
                flag = true;
              }
            });
            if (flag) {
              setSteps(s);
            }
          } else {
            setSteps(['']);
            setData([phase]);
            setActiveStep(0);
          }
        }
      });
    }
  }, [coral]);

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};

          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}

        <IconButton aria-label="add" onClick={handleAddMore}>
          <AddIcon />
        </IconButton>
      </Stepper>
      <>
        <Paper sx={{ p: 3, my: 3, minHeight: 120, bgcolor: 'grey.50012' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 3, sm: 2 }}
            justifyContent="space-between"
          >
            <Typography sx={{ my: 1 }}> {translate('page.coral-phase.form.header')} </Typography>
            <IconButton aria-label="delete" onClick={handleClickOpen}>
              <DeleteIcon />
            </IconButton>
          </Stack>

          <CoralPhasesTypeNewForm
            key={activeStep}
            isEdit={false}
            currentPhasesType={data[activeStep]}
            submitRef={submitRef}
            onSubmit={callback}
          />
        </Paper>
        <Box sx={{ display: 'flex' }}>
          <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
            {translate('button.back')}
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="contained" onClick={handleNext}>
            {activeStep === steps.length - 1
              ? translate('button.save.finish')
              : translate('button.save.next')}
          </Button>
        </Box>
      </>
      <Dialog open={open} onClose={handleClose} aria-labelledby="draggable-dialog-title">
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          {translate('message.title.confirm-delete')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{translate('message.confirm-delete')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            {translate('button.save.cancel')}
          </Button>
          <Button
            onClick={(event) => {
              handleDelete();
              handleClose();
            }}
          >
            {translate('button.save.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
