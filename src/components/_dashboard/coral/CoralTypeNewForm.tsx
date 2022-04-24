import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
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
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { CoralType } from '../../../@types/user';
//
import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';

// ----------------------------------------------------------------------
import countries from './countries';

const CATEGORY_OPTION = [{ group: 'Coral', classify: ['Select level', '1', '2', '3', '4', '5'] }];
const CATEGORY_OPTION2 = [{ group: 'Coral', classify: ['11', '22', '33', '4', '5'] }];

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
  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    parent: Yup.string().required('Parent is required'),
    level: Yup.string().required('Level is required'),
    description: Yup.string().required('Description is required')
  });
  const [currentLevel, setCurrenLevel] = useState('');
  const [genusOption, setGeneusOption] = useState([]);
  const [familyOption, setFamilyOption] = useState([]);
  const [orderOption, setOrderOption] = useState([
    { id: ``, name: ``, parentID: ``, level: ``, description: `` }
  ]);
  const [classOption, setClassOption] = useState([
    { id: ``, name: ``, parentID: ``, level: ``, description: `` }
  ]);
  const [currentClass, setCurrentClass] = useState('');
  const [currentOrder, setCurrentOrder] = useState('');

  const getOption = async (id: string) => {
    if (parseInt(id, 10) > 1) {
      await manageCoral.getCoralType(id).then((response) => {
        setClassOption(response.data.items);
      });
    }
  };

  const resetSelectedOption = (level: string) => {
    // 0-all,1-from class,2-order,
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentType?.id || '',
      name: currentType?.name || '',
      parentID: currentType?.parentID || CATEGORY_OPTION[0].classify[0],
      level: currentType?.level || CATEGORY_OPTION[0].classify[0],
      description: currentType?.description || ''
      // className: currentType?.description || '',
      // orderName: currentType?.description || '',
      // familyName: currentType?.description || '',
      // GenusName: currentType?.description || '',
      // speciesName: currentType?.description || ''
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await manageCoral.createCoralType(values);
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.coral.listType);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const onchangeLevel = (event: any) => {
    setCurrenLevel(event.target.value);
    getOption(event.target.value);
  };

  const onchangeLevel1 = (val: any) => {
    console.log(val.target);
    console.log(val);
  };

  const onchangeClassName = (event: any) => {
    // call api get all class Name
    setCurrentClass(event.target.value);
    getOption(event.target.value);
  };

  const onchangeOrderName = (event: any) => {
    setCurrentOrder(event.target.value);
  };

  const onchangeFamilyName = (event: any) => {
    setCurrenLevel(event.target.value);
  };

  const onchangeGenusName = (event: any) => {
    setCurrenLevel(event.target.value);
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
                  <FormControl fullWidth>
                    <InputLabel>Level Type</InputLabel>
                    <Select
                      label="Level Type"
                      native
                      // {...getFieldProps('level')}
                      value={currentLevel}
                      onChange={onchangeLevel}
                    >
                      {CATEGORY_OPTION.map((category) => (
                        <optgroup key={category.group} label={category.group}>
                          {category.classify.map((classify) => (
                            <option key={classify} value={classify}>
                              {classify}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Type Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Stack>

                {currentLevel === '2' ||
                currentLevel === '3' ||
                currentLevel === '4' ||
                currentLevel === '5' ? (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Class name</InputLabel>
                      <Select
                        label="Class name"
                        native
                        {...getFieldProps('level')}
                        value={currentClass}
                        onChange={onchangeClassName}
                      >
                        <optgroup key="Class name" label="Class name">
                          {classOption.map((classify) => (
                            <option key={classify.id} value={classify.id}>
                              {classify.name}
                            </option>
                          ))}
                        </optgroup>
                      </Select>
                    </FormControl>
                  </Stack>
                ) : (
                  <></>
                )}
                {currentLevel === '3' || currentLevel === '4' || currentLevel === '5' ? (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Order name</InputLabel>
                      <Select
                        label="Order name"
                        native
                        {...getFieldProps('level')}
                        value={currentOrder}
                        onChange={onchangeOrderName}
                      >
                        <optgroup key="Order name" label="Order name">
                          {orderOption.map((classify) => (
                            <option key={classify.id} value={classify.id}>
                              {classify.name}
                            </option>
                          ))}
                        </optgroup>
                      </Select>
                    </FormControl>
                  </Stack>
                ) : (
                  <></>
                )}
                {currentLevel === '4' || currentLevel === '5' ? (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Family name</InputLabel>
                      <Select
                        label="Family name"
                        native
                        {...getFieldProps('level')}
                        value={values.level}
                      >
                        {CATEGORY_OPTION.map((category) => (
                          <optgroup key={category.group} label={category.group}>
                            {category.classify.map((classify) => (
                              <option key={classify} value={classify}>
                                {classify}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                ) : (
                  <></>
                )}
                {currentLevel === '5' ? (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Genus name</InputLabel>
                      <Select
                        label="Genus name"
                        native
                        {...getFieldProps('level')}
                        value={values.level}
                      >
                        {CATEGORY_OPTION.map((category) => (
                          <optgroup key={category.group} label={category.group}>
                            {category.classify.map((classify) => (
                              <option key={classify} value={classify}>
                                {classify}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                ) : (
                  <></>
                )}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <div>
                    <LabelStyle>Description</LabelStyle>
                    <QuillEditor
                      simple
                      id="product-description"
                      value={values.description}
                      onChange={(val) => setFieldValue('description', val)}
                      // onChange={(val) => onchangeLevel1(val)}
                      // onChange={onchangeLevel1}
                      error={Boolean(touched.description && errors.description)}
                    />
                    {touched.description && errors.description && (
                      <FormHelperText error sx={{ px: 2 }}>
                        {touched.description && errors.description}
                      </FormHelperText>
                    )}
                  </div>
                </Stack>
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
