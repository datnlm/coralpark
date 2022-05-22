import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { manageCoral } from '_apis_/coral';
// material
import { styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import {
  Card,
  Box,
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
  FormControlLabel
} from '@material-ui/core';
// utils
import { OptionStatus, coralLevelTypeOptions } from 'utils/constants';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { CoralType } from '../../../@types/user';
//
import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';

// ----------------------------------------------------------------------
import countries from './countries';

const CATEGORY_OPTION = [{ group: 'Coral', classify: ['1', '2', '3', '4', '5'] }];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

type CoralTypeNewFromProps = {
  isEdit: boolean;
  currentType?: CoralType;
};

export default function CoralTypeNewFrom({ isEdit, currentType }: CoralTypeNewFromProps) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [optionsClass, setOptionsClass] = useState([]);
  const [optionsOrder, setOptionsOrder] = useState([]);
  const [optionsFamily, setOptionsFamily] = useState([]);
  const [optionsGenus, setOptionsGenus] = useState([]);
  // old version
  // const [currentLevel, setCurrenLevel] = useState(1);
  // new current level
  const [currentLevel, setCurrentLevel] = useState<OptionStatus | any>(coralLevelTypeOptions[0]);
  const [currentClass, setCurrentClass] = useState<any>(null);
  // old version
  // const [currentClass, setCurrentClass] = useState<any>([]);
  // const [currentOrder, setCurrentOrder] = useState('');
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [currentFamily, setCurrentFamily] = useState<any>(null);
  const [currentGenus, setCurrentGenus] = useState<any>(null);
  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    parent: Yup.string().required('Parent is required'),
    class: Yup.string().required('Class is required'),
    // level: Yup.string().required('Level is required'),
    description: Yup.string().required('Description is required')
  });

  // call class name parent id = null
  useEffect(() => {
    manageCoral.getCoralType('class').then((response) => {
      if (response.status == 200) {
        setOptionsClass(response.data.items);
        console.log(response.data.items);
      }
    });
  }, []);

  // call order name parent class id = ?
  useEffect(() => {
    setCurrentOrder(null);
    setOptionsOrder([]);
    // setCurrentOrder([]);
    if (currentClass != null) {
      // if (currentClass!.id != null) {
      manageCoral.getCoralType(currentClass!.id).then((response) => {
        if (response.status == 200) {
          setOptionsOrder(response.data.items);
          console.log(response.data.items);
        } else {
          setOptionsOrder([]);
        }
      });
    }
  }, [currentClass]);

  // call family name theo order id = ?
  useEffect(() => {
    setCurrentFamily(null);
    setOptionsFamily([]);
    if (currentOrder != null) {
      manageCoral.getCoralType(currentOrder!.id).then((response) => {
        if (response.status == 200) {
          setOptionsFamily(response.data.items);
        } else {
          setOptionsFamily([]);
        }
      });
    }
  }, [currentOrder]);

  // call Genus name theo family id = ?
  useEffect(() => {
    setCurrentGenus(null);
    setOptionsGenus([]);
    if (currentFamily != null) {
      // if (currentFamily!.id != null) {
      manageCoral.getCoralType(currentFamily!.id).then((response) => {
        if (response.status == 200) {
          console.log(response.data.items);
          setOptionsGenus(response.data.items);
        } else {
          setOptionsGenus([]);
        }
      });
    }
  }, [currentFamily]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentType?.id || '',
      name: currentType?.name || '',
      parentId: currentType?.parentId || '',
      levelType: currentType?.levelType || CATEGORY_OPTION[0].classify[0],
      description: currentType?.description || '',
      parents: currentType?.parents || '',
      class: currentType?.class || '',
      order: currentType?.order || '',
      family: currentType?.family || '',
      genus: currentType?.genus || '',
      species: currentType?.species || ''
    },
    // validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        // level 1 - class
        // level 2 - order
        // level 3 - family
        // level 4 - genus
        // level 5 - species
        switch (currentLevel!.id) {
          case '1':
            values.parentId = '';
            break;
          case '2':
            values.parentId = currentClass!.id;
            break;
          case '3':
            values.parentId = currentOrder!.id;
            break;
          case '4':
            values.parentId = currentFamily!.id;
            break;
          case '5':
            values.parentId = currentGenus!.id;
            break;
          default:
            console.log('default');
            break;
        }

        let flag = false;

        values.levelType = currentLevel!.id;
        !isEdit
          ? await manageCoral.createCoralType(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageCoral.createCoralType(values).then((response) => {
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
          navigate(PATH_DASHBOARD.coral.listType);
        } else {
          enqueueSnackbar(!isEdit ? 'Create error' : 'Update error', { variant: 'error' });
        }
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const onchangeLevel = (event: any) => {
    setCurrentLevel(event.target.value);
  };

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    clearIcon
                    id="levelType"
                    value={currentLevel}
                    options={coralLevelTypeOptions}
                    getOptionLabel={(option: OptionStatus) => option.label}
                    onChange={(e, values: OptionStatus | null) => setCurrentLevel(values)}
                    renderInput={(params) => <TextField {...params} label="Level Type" />}
                  />
                </Stack>
                {currentLevel!.id > 1 && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      clearIcon
                      id="class"
                      value={currentClass}
                      options={optionsClass}
                      getOptionLabel={(option: any) => option.name}
                      onChange={(e, value: any) => setCurrentClass(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Class"
                          error={Boolean(touched.class && errors.class)}
                          helperText={touched.class && errors.class}
                        />
                      )}
                    />
                    {currentLevel!.id > 2 && (
                      <Autocomplete
                        fullWidth
                        disablePortal
                        clearIcon
                        id="order"
                        value={currentOrder}
                        options={optionsOrder}
                        getOptionLabel={(option: any) => option.name}
                        onChange={(e, value: any) => setCurrentOrder(value)}
                        renderInput={(params) => <TextField {...params} label="Order" />}
                      />
                    )}
                  </Stack>
                )}
                {currentLevel!.id > 3 && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      clearIcon
                      id="family"
                      value={currentFamily}
                      options={optionsFamily}
                      getOptionLabel={(option) => option.name}
                      onChange={(e, value) => setCurrentFamily(value)}
                      renderInput={(params) => <TextField {...params} label="Family" />}
                    />
                    {currentLevel!.id > 4 && (
                      <Autocomplete
                        fullWidth
                        disablePortal
                        clearIcon
                        id="Genus"
                        value={currentGenus}
                        options={optionsGenus}
                        getOptionLabel={(option) => option.name}
                        onChange={(e, value) => setCurrentGenus(value)}
                        renderInput={(params) => <TextField {...params} label="Genus" />}
                      />
                    )}
                  </Stack>
                )}
                {currentLevel!.id >= 1 && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      label="Name"
                      {...getFieldProps('name')}
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Stack>
                )}
                <div>
                  <LabelStyle>Description</LabelStyle>
                  <QuillEditor
                    simple
                    id="description"
                    value={values.description}
                    onChange={(val) => setFieldValue('description', val)}
                    error={Boolean(touched.description && errors.description)}
                  />
                  {touched.description && errors.description && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {touched.description && errors.description}
                    </FormHelperText>
                  )}
                </div>
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
