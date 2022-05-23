import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { manageArea } from '_apis_/area';
// material
import { styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import {
  Card,
  Chip,
  Grid,
  Stack,
  Radio,
  Switch,
  Select,
  TextField,
  InputLabel,
  Typography,
  RadioGroup,
  FormControl,
  Autocomplete,
  InputAdornment,
  FormHelperText,
  FormControlLabel,
  Box
} from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Area } from '../../../@types/area';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

type AreaNewFormProps = {
  isEdit: boolean;
  currentArea?: Area;
};

export default function AreaNewForm({ isEdit, currentArea }: AreaNewFormProps) {
  const [optionsProvince, setOptionsProvince] = useState([]);
  const [optionsDistrict, setOptionsDistrict] = useState([]);
  const [optionsWard, setOptionsWard] = useState([]);
  const [currentProvince, setCurrentProvince] = useState<any>(null);
  const [currentDistrict, setCurrentDistrict] = useState<any>(null);
  const [currentWard, setCurrentWard] = useState<any>(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const NewProductSchema = Yup.object().shape({
    wellKnownText: Yup.string().required('Well known Text is required'),
    address: Yup.string().required('Address is required')
  });

  const checkSelected = (provice: string) => {
    return (
      <option key={provice} value={provice}>
        {provice}
      </option>
    );
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      address: currentArea?.address || '',
      wellKnownText: currentArea?.wellKnownText || ' '
    },
    validationSchema: NewProductSchema,

    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        // console.log(values);

        // if (isEdit) {
        //   await manageArea.updateArea(
        //     currentArea!.id,
        //     values.location,
        //     values.address,
        //     values.province
        //   );
        // } else {
        //   console.log('create');
        //   await manageArea.createArea(values.location, values.address, values.province);
        // }

        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.area.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        // setErrors(error);
      }
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
    handleChange
  } = formik;

  useEffect(() => {
    manageArea.getProvince('0').then((response) => {
      if (response.status == 200) {
        setOptionsProvince(response.data.items);
      } else {
        setOptionsProvince([]);
      }
    });
  }, []);
  useEffect(() => {
    setCurrentDistrict(null);
    setOptionsDistrict([]);
    if (currentProvince != null) {
      manageArea.getProvince(currentProvince.id.toString()).then((response) => {
        if (response.status == 200) {
          setOptionsDistrict(response.data.items);
        } else {
          setOptionsDistrict([]);
        }
      });
    }
  }, [currentProvince]);

  useEffect(() => {
    setCurrentWard(null);
    setOptionsWard([]);
    if (currentDistrict != null) {
      manageArea.getProvince(currentDistrict.id.toString()).then((response) => {
        if (response.status == 200) {
          setOptionsWard(response.data.items);
        } else {
          setOptionsWard([]);
        }
      });
    }
  }, [currentDistrict]);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField fullWidth label="wellKnownText" {...getFieldProps('email')} />

                  <Autocomplete
                    fullWidth
                    disablePortal
                    clearIcon
                    disabled={isEdit}
                    id="province"
                    value={currentProvince}
                    options={optionsProvince}
                    getOptionLabel={(option: any) => option.name}
                    onChange={(e, value: any) => setCurrentProvince(value)}
                    renderInput={(params) => <TextField {...params} label="Province" />}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    clearIcon
                    disabled={isEdit}
                    id="district"
                    value={currentDistrict}
                    options={optionsDistrict}
                    getOptionLabel={(option: any) => option.name}
                    onChange={(e, value: any) => setCurrentDistrict(value)}
                    renderInput={(params) => <TextField {...params} label="District" />}
                  />
                  <Autocomplete
                    fullWidth
                    disablePortal
                    clearIcon
                    disabled={isEdit}
                    id="ward"
                    value={currentWard}
                    options={optionsWard}
                    getOptionLabel={(option: any) => option.name}
                    onChange={(e, value: any) => setCurrentWard(value)}
                    renderInput={(params) => <TextField {...params} label="Ward" />}
                  />
                </Stack>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Area' : 'Save Changes'}
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
