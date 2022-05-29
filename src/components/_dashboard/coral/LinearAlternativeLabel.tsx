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
  Grid,
  Card,
  Autocomplete
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CoralPhasesNewForm from 'components/_dashboard/coral/CoralPhasesNewForm';
import CoralPhasesTypeNewForm from 'components/_dashboard/coral/CoralPhasesTypeNewForm';
import { manageCoral } from '_apis_/coral';
import { Coral, PhaseForm, PhasesType } from '../../../@types/coral';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------
const phase: PhasesType = {
  id: '',
  minWeight: '',
  maxWeight: '',
  minHigh: '',
  maxHigh: '',
  timeForm: '',
  timeTo: '',
  coulour: '',
  coralID: '',
  phaseID: ''
};

export type OptionStatus = {
  id: any;
  label: string;
};

// const steps = ['Phase 1'];

export default function LinearAlternativeLabel() {
  const callback = (params: PhasesType) => {
    const dt = data;
    dt[activeStep] = params;
    setData(dt);
  };
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [optionCoralPhases, setOptionCoralPhases] = useState([]);
  const [optionCoral, setOptionCoral] = useState([]);
  const [steps, setSteps] = useState(['']);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [data, setData] = useState<PhasesType[]>([phase]);
  const submitRef = useRef<HTMLInputElement>(null);
  const [coral, setCoral] = useState<any>(null);

  // const [formCoralPhaseType, setFormCoralPhaseType] = useState<any>([
  //   <CoralPhasesTypeNewForm
  //     key={0}
  //     isEdit={false}
  //     currentPhasesType={data[0]}
  //     onSubmit={callback}
  //   />
  // ]);

  const isStepOptional = (step: number) => step === 1;

  const isStepSkipped = (step: number) => skipped.has(step);

  const handleNext = async () => {
    // call api
    if (activeStep == steps.length - 1) {
      try {
        // let flag = false;

        const formPhase = {
          coralId: coral!.id,
          phase: data
        };
        console.log(formPhase);
        // await manageCoral.createCoralPhasesType(formPhase).then((response) => {
        //   if (response.status == 200) {
        //     flag = true;
        //   }
        // });
        // !isEdit
        // ? await manageCoral.createCoralPhasesType(values).then((response) => {
        //     if (response.status == 200) {
        //       flag = true;
        //     }
        //   })
        // : await manageCoral.updateCoralPhasesType(values).then((response) => {
        //     if (response.status == 200) {
        //       flag = true;
        //     }
        //   });
        // if (flag) {
        // resetForm();
        // setSubmitting(false);
        // enqueueSnackbar('Create success', {
        // variant: 'success'
        // });
        // enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', {
        //   variant: 'success'
        // });
        // navigate(PATH_DASHBOARD.phases.typeNew);
        // } else {
        // enqueueSnackbar('Create error', { variant: 'error' });
        // enqueueSnackbar(!isEdit ? 'Create error' : 'Update error', { variant: 'error' });
        // }
      } catch (error) {
        console.log(error);
        // console.error(error);
        // setSubmitting(false);
        // setErrors(error);
      }
      return;
    }
    if (submitRef && submitRef.current) {
      submitRef.current?.click();
    }

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleAddMore = () => {
    const s = steps;
    const dt = data;
    const phase: PhasesType = {
      id: '',
      minWeight: '',
      maxWeight: '',
      minHigh: '',
      maxHigh: '',
      timeForm: '',
      timeTo: '',
      coulour: '',
      coralID: '',
      phaseID: ''
    };
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

  // get combobox
  useEffect(() => {
    manageCoral.getListCoral().then((response) => {
      if (response.status == 200) {
        setOptionCoral(response.data.items);
      } else {
        setOptionCoral([]);
      }
    });
  }, []);

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
      {activeStep === steps.length ? (
        <>
          {/* <Paper sx={{ p: 3, my: 3, minHeight: 120, bgcolor: 'grey.50012' }}>
            <Typography sx={{ my: 1 }}>All steps completed - you&apos;re finished</Typography>
          </Paper> */}

          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flexGrow: 1 }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </>
      ) : (
        <>
          <Paper sx={{ p: 3, my: 3, minHeight: 120, bgcolor: 'grey.50012' }}>
            <Stack spacing={3}>
              <Autocomplete
                fullWidth
                disablePortal
                clearIcon
                id="coral"
                value={coral}
                options={optionCoral}
                getOptionLabel={(option: any) => (option ? option.name : '')}
                onChange={(e, value: any) => setCoral(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Coral"
                    // error={Boolean(touched.phaseID && errors.phaseID)}
                    // helperText={touched.phaseID && errors.phaseID}
                  />
                )}
              />
            </Stack>
            <Typography sx={{ my: 1 }}> Phases Type </Typography>

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
              Back
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </>
      )}
    </>
  );
}
