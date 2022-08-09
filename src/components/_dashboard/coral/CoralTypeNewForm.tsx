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
// hook
import useLocales from '../../../hooks/useLocales';
// @types
import { CoralType } from '../../../@types/coral';
//
import { QuillEditor } from '../../editor';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

type CoralTypeNewFromProps = {
  isEdit: boolean;
  currentType?: CoralType | null;
};

export default function CoralTypeNewFrom({ isEdit, currentType }: CoralTypeNewFromProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [optionsClass, setOptionsClass] = useState([]);
  const [optionsOrder, setOptionsOrder] = useState([]);
  const [optionsFamily, setOptionsFamily] = useState([]);
  const [optionsGenus, setOptionsGenus] = useState([]);
  const [currentLevel, setCurrentLevel] = useState<OptionStatus | any>(coralLevelTypeOptions[1]);
  const [currentClass, setCurrentClass] = useState<any>(null);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [currentFamily, setCurrentFamily] = useState<any>(null);
  const [currentGenus, setCurrentGenus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [NewProductSchema, setNewProductSchema] = useState<any>();

  useEffect(() => {
    const object = {
      name: Yup.string()
        .required(translate('message.form.name'))
        .min(3, translate('message.form.name_length_50'))
        .max(50, translate('message.form.name_length_50'))
    };
    if (currentLevel!.id >= '2') {
      Object.assign(object, {
        class: Yup.object().required('Class is required').nullable(true)
      });
    }
    if (currentLevel!.id >= '3') {
      Object.assign(object, { order: Yup.object().required('Order is required').nullable(true) });
    }
    if (currentLevel!.id >= '4') {
      Object.assign(object, {
        family: Yup.object().required('Family is required').nullable(true)
      });
    }
    if (currentLevel!.id == '5') {
      Object.assign(object, {
        genus: Yup.object().required('Genus is required').nullable(true)
      });
    }
    setNewProductSchema(Yup.object().shape(object));
  }, [currentLevel]);

  // call class name parent id = null
  useEffect(() => {
    if (!isEdit) {
      setIsLoading(true);
      manageCoral.getCoralType('class', 0, -1).then((response) => {
        if (response.status == 200) {
          setOptionsClass(response.data.items);
          setIsLoading(false);
        }
      });
    }
  }, []);

  // call order name parent class id = ?
  useEffect(() => {
    if (!isEdit) {
      setIsLoading(true);
      setCurrentOrder(null);
      setOptionsOrder([]);
      if (currentClass != null) {
        manageCoral.getCoralType(currentClass!.id, 0, -1).then((response) => {
          if (response.status == 200) {
            setOptionsOrder(response.data.items);
            setIsLoading(false);
          } else {
            setOptionsOrder([]);
            setIsLoading(false);
          }
        });
      }
    }
  }, [currentClass]);

  // call family name theo order id = ?
  useEffect(() => {
    if (!isEdit) {
      setIsLoading(true);
      setCurrentFamily(null);
      setOptionsFamily([]);
      if (currentOrder != null) {
        manageCoral.getCoralType(currentOrder!.id, 0, -1).then((response) => {
          if (response.status == 200) {
            setOptionsFamily(response.data.items);
            setIsLoading(false);
          } else {
            setOptionsFamily([]);
            setIsLoading(false);
          }
        });
      }
    }
  }, [currentOrder]);

  // call Genus name theo family id = ?
  useEffect(() => {
    if (!isEdit) {
      setIsLoading(true);
      setCurrentGenus(null);
      setOptionsGenus([]);
      if (currentFamily) {
        if (currentFamily!.id != null) {
          manageCoral.getCoralType(currentFamily!.id, 0, -1).then((response) => {
            if (response.status == 200) {
              setOptionsGenus(response.data.items);
              setIsLoading(false);
            } else {
              setOptionsGenus([]);
              setIsLoading(false);
            }
          });
        }
      }
    }
  }, [currentFamily]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentType?.id || '',
      name: currentType?.name || '',
      parentId: currentType?.parentId || '',
      levelType: currentType?.levelType || '',
      description: currentType?.description || '',
      parents: currentType?.parents || '',
      class: currentClass,
      order: currentOrder,
      family: currentFamily,
      genus: currentGenus
    },
    validationSchema: NewProductSchema,
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
                navigate(PATH_DASHBOARD.coral.listType);
              }
            })
          : await manageCoral.updateCoralType(values).then((response) => {
              if (response.status == 200) {
                flag = true;
                navigate(PATH_DASHBOARD.coral.listType);
              }
            });
        if (flag) {
          resetForm();
          setSubmitting(false);
          enqueueSnackbar(
            !isEdit ? translate('message.create-success') : translate('message.update-success'),
            {
              variant: 'success'
            }
          );
        } else {
          enqueueSnackbar(
            !isEdit ? translate('message.create-error') : translate('message.update-error'),
            { variant: 'error' }
          );
        }
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  // set value when edit
  useEffect(() => {
    if (isEdit) {
      setCurrentLevel(
        coralLevelTypeOptions.find((e: any) => e.id == currentType?.levelType) ||
          coralLevelTypeOptions[0]
      );
      if (currentType?.parents) {
        currentType?.parents.map((value: any) => {
          switch (value.levelType) {
            case 1:
              setCurrentClass(value);
              setOptionsClass(value);
              break;
            case 2:
              setCurrentOrder(value);
              setOptionsOrder(value);
              break;
            case 3:
              setCurrentFamily(value);
              setOptionsFamily(value);
              break;
            case 4:
              setCurrentGenus(value);
              setOptionsGenus(value);
              break;
            default:
              console.log('default');
              break;
          }
        });
      }
    }
  }, [currentType]);

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
                    disableClearable
                    disablePortal
                    getOptionDisabled={(option: OptionStatus) => option.id == 0}
                    clearIcon
                    id="levelType"
                    disabled={isEdit}
                    value={currentLevel}
                    options={coralLevelTypeOptions}
                    getOptionLabel={(option: OptionStatus) =>
                      translate(`status.coral_level_type.${option.id}`)
                    }
                    onChange={(e, values: OptionStatus | null) => setCurrentLevel(values)}
                    renderInput={(params) => (
                      <TextField {...params} label={translate('page.coral-type.form.level')} />
                    )}
                  />
                </Stack>
                {currentLevel!.id > 1 && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      clearIcon
                      disabled={isEdit}
                      id="class"
                      loading={isLoading}
                      value={currentClass}
                      options={optionsClass}
                      getOptionLabel={(option: any) => option.name}
                      onChange={(e, value: any) => {
                        setCurrentClass(value);
                        setFieldValue('class', value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={translate('page.coral-type.form.class')}
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
                        disabled={isEdit}
                        id="order"
                        loading={isLoading}
                        value={currentOrder}
                        options={optionsOrder}
                        getOptionLabel={(option: any) => option.name}
                        onChange={(e, value: any) => {
                          setCurrentOrder(value);
                          setFieldValue('order', value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={translate('page.coral-type.form.order')}
                            error={Boolean(touched.order && errors.order)}
                            helperText={touched.order && errors.order}
                          />
                        )}
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
                      disabled={isEdit}
                      id="family"
                      loading={isLoading}
                      value={currentFamily}
                      options={optionsFamily}
                      getOptionLabel={(option) => option.name}
                      onChange={(e, value) => {
                        setCurrentFamily(value);
                        setFieldValue('family', value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={translate('page.coral-type.form.family')}
                          error={Boolean(touched.family && errors.family)}
                          helperText={touched.family && errors.family}
                        />
                      )}
                    />
                    {currentLevel!.id > 4 && (
                      <Autocomplete
                        fullWidth
                        disablePortal
                        clearIcon
                        disabled={isEdit}
                        id="Genus"
                        loading={isLoading}
                        value={currentGenus}
                        options={optionsGenus}
                        getOptionLabel={(option) => option.name}
                        onChange={(e, value) => {
                          setCurrentGenus(value);
                          setFieldValue('family', value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={translate('page.coral-type.form.genus')}
                            error={Boolean(touched.genus && errors.genus)}
                            helperText={touched.genus && errors.genus}
                          />
                        )}
                      />
                    )}
                  </Stack>
                )}
                {currentLevel!.id >= 1 && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      label={translate('page.coral-type.form.name')}
                      {...getFieldProps('name')}
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Stack>
                )}
                <div>
                  <LabelStyle>{translate('page.coral-type.form.description')}</LabelStyle>
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
                    {!isEdit ? translate('button.save.add') : translate('button.save.update')}
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
