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
import CoralPhasesTypeNewForm from 'components/_dashboard/coral/CoralPhasesTypeNewForm';
import { manageCoral } from '_apis_/coral';
import { RootState, useSelector } from 'redux/store';
import { Coral, PhaseForm, PhasesType } from '../../../@types/coral';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import useLocales from '../../../hooks/useLocales';

// ----------------------------------------------------------------------
const phase: PhasesType = {
  id: '',
  minWeight: '',
  maxWeight: '',
  minHigh: '',
  maxHigh: '',
  timeFrom: '',
  timeTo: '',
  colour: '',
  coralId: '',
  coralPhaseId: ''
};

export type OptionStatus = {
  id: any;
  label: string;
};

// const steps = ['Phase 1'];

export default function LinearAlternativeLabel() {
  const { translate } = useLocales();
  const [isEdit, setIsEdit] = useState<Boolean>(false);
  const listCoral = useSelector((state: RootState) => state.coral.coralList);
  const listPhase = useSelector((state: RootState) => state.coral.coralPhaseList);
  const isLoading = useSelector((state: RootState) => state.coral.isLoading);

  const callback = async (params: PhasesType) => {
    if (params) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    const dt = data;
    dt[activeStep] = params;
    setData(dt);

    if (activeStep == steps.length - 1) {
      try {
        const formPhase = {
          id: coral!.id,
          coralPhaseTypes: data
        };
        let flag = false;
        !isEdit
          ? await manageCoral.createCoralPhasesType(formPhase).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageCoral.updateCoralPhasesType(formPhase).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            });
        if (flag) {
          enqueueSnackbar(
            !isEdit ? translate('message.create-success') : translate('message.update-success'),
            {
              variant: 'success'
            }
          );
          navigate(PATH_DASHBOARD.phases.typeNew);
        } else {
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
    if (submitRef && submitRef.current) {
      submitRef.current?.click();
    }
    // setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
      timeFrom: '',
      timeTo: '',
      colour: '',
      coralId: '',
      coralPhaseId: ''
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

  useEffect(() => {
    if (coral != null) {
      manageCoral.getCoralByID(coral.id).then((response) => {
        if (response.status == 200) {
          const phaseType = response.data.coralPhaseTypes;
          if (phaseType != []) {
            setIsEdit(true);
            setData(phaseType);
            const s: any[] = [];
            // flag setSteps if true
            let flag = false;
            phaseType.map((v: any) => {
              // set label for coral phase
              if (v.coralPhaseId != null) {
                s.push(listPhase.find((value) => value.id == v.coralPhaseId)?.name);
                // s.push(v.coralPhaseId);
                flag = true;
              }
            });
            if (flag) {
              setSteps(s);
            }
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
      {activeStep === steps.length ? (
        <>
          <Paper sx={{ p: 3, my: 3, minHeight: 120, bgcolor: 'grey.50012' }}>
            <Typography sx={{ my: 1 }}>All steps completed - you&apos;re finished</Typography>
          </Paper>

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
                options={listCoral}
                loading={isLoading}
                getOptionLabel={(option: any) => (option ? option.name : '')}
                onChange={(e, value: any) => setCoral(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={translate('page.coral-phase.form.coral')}
                    // error={Boolean(touched.phaseID && errors.phaseID)}
                    // helperText={touched.phaseID && errors.phaseID}
                  />
                )}
              />
            </Stack>
            <Typography sx={{ my: 1 }}> {translate('page.coral-phase.form.header')} </Typography>

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
            {/* {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                {translate('button.skip')}
              </Button>
            )} */}
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1
                ? translate('button.save.finish')
                : translate('button.save.next')}
            </Button>
          </Box>
        </>
      )}
    </>
  );
}
