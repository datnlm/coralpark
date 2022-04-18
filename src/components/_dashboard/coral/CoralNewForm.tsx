import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { FormEvent, useCallback, useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
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
import { UserManager, Coral } from '../../../@types/user';
//
import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';

// ----------------------------------------------------------------------
import countries from './countries';

const GENDER_OPTION = ['Men', 'Women', 'Kids'];

const TAGS_OPTION = [
  'Toy Story 3',
  'Logan',
  'Full Metal Jacket',
  'Dangal',
  'The Sting',
  '2001: A Space Odyssey',
  "Singin' in the Rain",
  'Toy Story',
  'Bicycle Thieves',
  'The Kid',
  'Inglourious Basterds',
  'Snatch',
  '3 Idiots'
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

type UserNewFormProps = {
  isEdit: boolean;
  // currentUser?: UserManager;
  currentCoral: Coral;
};

export default function UserNewForm({ isEdit, currentCoral }: UserNewFormProps) {
  const [currentCoralType, setCurrentCoralType] = useState({
    id: currentCoral?.id || '',
    name: currentCoral?.name || '',
    imageUrl: [],
    scientificName: currentCoral?.scientificName || '',
    longevity: currentCoral?.longevity || '',
    exhibitSocial: currentCoral?.exhibitSocial || '',
    sexualBehaviors: currentCoral?.sexualBehaviors || '',
    nutrition: currentCoral?.nutrition || '',
    colour: currentCoral?.colour || '',
    description: currentCoral?.description || '',
    coralTypeId: currentCoral?.coralTypeId || '',
    status: currentCoral?.status || '',
    statusEnum: currentCoral?.statusEnum || '',
    className: currentCoral?.className || '',
    orderName: currentCoral?.orderName || '',
    familyName: currentCoral?.familyName || '',
    genusName: currentCoral?.genusName || '',
    speciesName: currentCoral?.speciesName || ''
  });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    imageUrl: Yup.string().required('imageUrl is required'),
    scientificName: Yup.string().required('scientificName is required'),
    longevity: Yup.string().required('longevity is required'),
    exhibitSocial: Yup.string().required('exhibitSocial is required'),
    sexualBehaviors: Yup.string().required('sexualBehaviors is required'),
    nutrition: Yup.string().required('nutrition is required'),
    colour: Yup.string().required('colour is required'),
    description: Yup.string().required('description is required'),
    coralTypeId: Yup.string().required('coralTypeId is required'),
    status: Yup.string().required('status is required'),
    statusEnum: Yup.string().required('statusEnum is required'),
    className: Yup.string().required('className is required'),
    orderName: Yup.string().required('orderName is required'),
    familyName: Yup.string().required('familyName is required'),
    genusName: Yup.array().min(1, 'genusName is required'),
    speciesName: Yup.array().min(1, 'speciesName is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentCoral?.id || '',
      name: currentCoral?.name || '',
      imageUrl: [],
      scientificName: currentCoral?.scientificName || '',
      longevity: currentCoral?.longevity || '',
      exhibitSocial: currentCoral?.exhibitSocial || '',
      sexualBehaviors: currentCoral?.sexualBehaviors || '',
      nutrition: currentCoral?.nutrition || '',
      colour: currentCoral?.colour || '',
      description: currentCoral?.description || '',
      coralTypeId: currentCoral?.coralTypeId || '',
      status: currentCoral?.status || '',
      statusEnum: currentCoral?.statusEnum || '',
      className: currentCoral?.className || '',
      orderName: currentCoral?.orderName || '',
      familyName: currentCoral?.familyName || '',
      genusName: currentCoral?.genusName || '',
      speciesName: currentCoral?.speciesName || ''
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await fakeRequest(500);
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.area.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
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

  // const handleDrop = useCallback(
  //   (acceptedFiles) => {
  //     setFieldValue(
  //       'images',
  //       acceptedFiles.map((file: File | string) =>
  //         Object.assign(file, {
  //           preview: URL.createObjectURL(file)
  //         })
  //       )
  //     );
  //   },
  //   [setFieldValue]
  // );

  const handleRemoveAll = () => {
    setFieldValue('images', []);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = values.imageUrl.filter((_file: string | File) => _file !== file);
    setFieldValue('images', filteredItems);
  };

  // const handleChange = (e : any) => {
  //   // setCurrentCoralType(formik.initialValues.coralTypeId.toString());
  //   console.log(e);
  // };

  // function handleChange() {
  //   console.log(formik.initialValues.colour);
  //   setCurrentCoralType('a');
  // }

  const handleOnChange = (event: any) => {
    console.log('Form::onChange', event.target.value);
    setCurrentCoralType(event.target.value);
    formik.initialValues.colour = event.target.value;
    console.log('init', formik.initialValues.colour);
  };
  // return (
  //   <FormikProvider value={formik}>
  //     <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
  //       <Grid container spacing={3}>
  //         <Grid item xs={12} md={8}>
  //           <Card sx={{ p: 3 }}>
  //             <Stack spacing={3}>
  //               <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
  //                 <TextField
  //                   fullWidth
  //                   label="Full Name"
  //                   {...getFieldProps('name')}
  //                   error={Boolean(touched.name && errors.name)}
  //                   helperText={touched.name && errors.name}
  //                 />
  //                 <TextField
  //                   fullWidth
  //                   label="Scientific Name"
  //                   {...getFieldProps('scientificName')}
  //                   error={Boolean(touched.scientificName && errors.scientificName)}
  //                   helperText={touched.scientificName && errors.scientificName}
  //                 />
  //               </Stack>

  //               <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
  //                 <TextField
  //                   fullWidth
  //                   label="Longevity"
  //                   {...getFieldProps('longevity')}
  //                   error={Boolean(touched.longevity && errors.longevity)}
  //                   helperText={touched.longevity && errors.longevity}
  //                 />
  //                 <TextField
  //                   fullWidth
  //                   label="genusName"
  //                   {...getFieldProps('genusName')}
  //                   error={Boolean(touched.genusName && errors.genusName)}
  //                   helperText={touched.genusName && errors.genusName}
  //                 />
  //               </Stack>

  //               <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
  //                 <TextField
  //                   fullWidth
  //                   label="Exhibit Social"
  //                   {...getFieldProps('exhibitSocial')}
  //                   error={Boolean(touched.exhibitSocial && errors.exhibitSocial)}
  //                   helperText={touched.exhibitSocial && errors.exhibitSocial}
  //                 />
  //                 <TextField
  //                   fullWidth
  //                   label="Sexual Behaviors"
  //                   {...getFieldProps('sexualBehaviors')}
  //                   error={Boolean(touched.sexualBehaviors && errors.sexualBehaviors)}
  //                   helperText={touched.sexualBehaviors && errors.sexualBehaviors}
  //                 />
  //               </Stack>
  //               <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
  //                 <TextField
  //                   fullWidth
  //                   label="Nutrition"
  //                   {...getFieldProps('nutrition')}
  //                   error={Boolean(touched.nutrition && errors.nutrition)}
  //                   helperText={touched.nutrition && errors.nutrition}
  //                 />
  //                 <TextField
  //                   fullWidth
  //                   label="Colour"
  //                   // {...getFieldProps('colour')}
  //                   value={currentCoralType.a}
  //                   error={Boolean(touched.colour && errors.colour)}
  //                   helperText={touched.colour && errors.colour}
  //                   onChange={handleOnChange}
  //                 />
  //               </Stack>
  //               <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
  //                 <TextField
  //                   select
  //                   fullWidth
  //                   label="Coral Type"
  //                   placeholder="Coral Type"
  //                   {...getFieldProps('coralTypeId')}
  //                   SelectProps={{ native: true }}
  //                   error={Boolean(touched.coralTypeId && errors.coralTypeId)}
  //                   helperText={touched.coralTypeId && errors.coralTypeId}
  //                   onChange={handleOnChange}
  //                 >
  //                   <option value="" />
  //                   {countries.map((option) => (
  //                     <option key={option.code} value={option.label}>
  //                       {option.label}
  //                     </option>
  //                   ))}
  //                 </TextField>
  //                 {/* <TextField
  //                   select
  //                   fullWidth
  //                   label="Habital"
  //                   placeholder="Habital"
  //                   {...getFieldProps('habital')}
  //                   SelectProps={{ native: true }}
  //                   error={Boolean(touched.habital && errors.habital)}
  //                   helperText={touched.habital && errors.habital}
  //                 >
  //                   <option value="" />
  //                   {countries.map((option) => (
  //                     <option key={option.code} value={option.label}>
  //                       {option.label}
  //                     </option>
  //                   ))}
  //                 </TextField> */}
  //                 {/* <TextField
  //                   fullWidth
  //                   label="Status"
  //                   {...getFieldProps('status')}
  //                   error={Boolean(touched.status && errors.status)}
  //                   helperText={touched.status && errors.status}
  //                 /> */}
  //                 <Autocomplete
  //                   id="country-select-demo"
  //                   fullWidth
  //                   options={countries}
  //                   autoHighlight
  //                   getOptionLabel={(option) => option.label}
  //                   renderOption={(props, option) => (
  //                     <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
  //                       {option.label}
  //                     </Box>
  //                   )}
  //                   renderInput={(params) => (
  //                     <TextField
  //                       {...params}
  //                       label="Status"
  //                       inputProps={{
  //                         ...params.inputProps,
  //                         autoComplete: 'new-password' // disable autocomplete and autofill
  //                       }}
  //                     />
  //                   )}
  //                 />
  //               </Stack>
  //               <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
  //                 <TextField
  //                   fullWidth
  //                   label="Status Enum"
  //                   {...getFieldProps('statusEnum')}
  //                   error={Boolean(touched.statusEnum && errors.statusEnum)}
  //                   helperText={touched.statusEnum && errors.statusEnum}
  //                 />
  //                 <TextField
  //                   fullWidth
  //                   label="className"
  //                   {...getFieldProps('className')}
  //                   error={Boolean(touched.className && errors.className)}
  //                   helperText={touched.className && errors.className}
  //                 />
  //               </Stack>
  //               <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
  //                 <TextField
  //                   fullWidth
  //                   label="orderName"
  //                   {...getFieldProps('orderName')}
  //                   error={Boolean(touched.orderName && errors.orderName)}
  //                   helperText={touched.orderName && errors.orderName}
  //                 />
  //                 <TextField
  //                   fullWidth
  //                   // label="Role"
  //                   label="familyName"
  //                   {...getFieldProps('familyName')}
  //                   error={Boolean(touched.familyName && errors.familyName)}
  //                   helperText={touched.familyName && errors.familyName}
  //                 />
  //               </Stack>

  //               <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
  //                 <div>
  //                   <LabelStyle>Description</LabelStyle>
  //                   <QuillEditor
  //                     simple
  //                     id="product-description"
  //                     value={values.description}
  //                     onChange={(val) => setFieldValue('description', val)}
  //                     error={Boolean(touched.description && errors.description)}
  //                   />
  //                   {touched.description && errors.description && (
  //                     <FormHelperText error sx={{ px: 2 }}>
  //                       {touched.description && errors.description}
  //                     </FormHelperText>
  //                   )}
  //                 </div>
  //               </Stack>

  //               <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
  //                 <div>
  //                   <LabelStyle>Add Images</LabelStyle>
  //                   <UploadMultiFile
  //                     showPreview
  //                     maxSize={3145728}
  //                     accept="image/*"
  //                     files={values.imageUrl}
  //                     // onDrop={handleDrop}
  //                     onRemove={handleRemove}
  //                     onRemoveAll={handleRemoveAll}
  //                     error={Boolean(touched.imageUrl && errors.imageUrl)}
  //                   />
  //                   {touched.imageUrl && errors.imageUrl && (
  //                     <FormHelperText error sx={{ px: 2 }}>
  //                       {touched.imageUrl && errors.imageUrl}
  //                     </FormHelperText>
  //                   )}
  //                 </div>
  //               </Stack>
  //               <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
  //                 <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
  //                   {!isEdit ? 'Create Coral' : 'Save Changes'}
  //                 </LoadingButton>
  //               </Box>
  //             </Stack>
  //           </Card>
  //         </Grid>
  //       </Grid>
  //     </Form>
  //   </FormikProvider>
  // );
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label="Scientific Name"
                    {...getFieldProps('scientificName')}
                    error={Boolean(touched.scientificName && errors.scientificName)}
                    helperText={touched.scientificName && errors.scientificName}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Longevity"
                    {...getFieldProps('longevity')}
                    error={Boolean(touched.longevity && errors.longevity)}
                    helperText={touched.longevity && errors.longevity}
                  />
                  <TextField
                    fullWidth
                    label="genusName"
                    {...getFieldProps('genusName')}
                    error={Boolean(touched.genusName && errors.genusName)}
                    helperText={touched.genusName && errors.genusName}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Exhibit Social"
                    {...getFieldProps('exhibitSocial')}
                    error={Boolean(touched.exhibitSocial && errors.exhibitSocial)}
                    helperText={touched.exhibitSocial && errors.exhibitSocial}
                  />
                  <TextField
                    fullWidth
                    label="Sexual Behaviors"
                    {...getFieldProps('sexualBehaviors')}
                    error={Boolean(touched.sexualBehaviors && errors.sexualBehaviors)}
                    helperText={touched.sexualBehaviors && errors.sexualBehaviors}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Nutrition"
                    {...getFieldProps('nutrition')}
                    error={Boolean(touched.nutrition && errors.nutrition)}
                    helperText={touched.nutrition && errors.nutrition}
                  />
                  <TextField
                    fullWidth
                    label="Colour"
                    // {...getFieldProps('colour')}
                    value={currentCoralType.colour}
                    error={Boolean(touched.colour && errors.colour)}
                    helperText={touched.colour && errors.colour}
                    onChange={handleOnChange}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Coral Type"
                    placeholder="Coral Type"
                    {...getFieldProps('coralTypeId')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.coralTypeId && errors.coralTypeId)}
                    helperText={touched.coralTypeId && errors.coralTypeId}
                    onChange={handleOnChange}
                  >
                    <option value="" />
                    {countries.map((option) => (
                      <option key={option.code} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                  {/* <TextField
                    select
                    fullWidth
                    label="Habital"
                    placeholder="Habital"
                    {...getFieldProps('habital')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.habital && errors.habital)}
                    helperText={touched.habital && errors.habital}
                  >
                    <option value="" />
                    {countries.map((option) => (
                      <option key={option.code} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField> */}
                  {/* <TextField
                    fullWidth
                    label="Status"
                    {...getFieldProps('status')}
                    error={Boolean(touched.status && errors.status)}
                    helperText={touched.status && errors.status}
                  /> */}
                  <Autocomplete
                    id="country-select-demo"
                    fullWidth
                    options={countries}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        {option.label}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Status"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password' // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Status Enum"
                    {...getFieldProps('statusEnum')}
                    error={Boolean(touched.statusEnum && errors.statusEnum)}
                    helperText={touched.statusEnum && errors.statusEnum}
                  />
                  <TextField
                    fullWidth
                    label="className"
                    {...getFieldProps('className')}
                    error={Boolean(touched.className && errors.className)}
                    helperText={touched.className && errors.className}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="orderName"
                    {...getFieldProps('orderName')}
                    error={Boolean(touched.orderName && errors.orderName)}
                    helperText={touched.orderName && errors.orderName}
                  />
                  <TextField
                    fullWidth
                    // label="Role"
                    label="familyName"
                    {...getFieldProps('familyName')}
                    error={Boolean(touched.familyName && errors.familyName)}
                    helperText={touched.familyName && errors.familyName}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <div>
                    <LabelStyle>Description</LabelStyle>
                    <QuillEditor
                      simple
                      id="product-description"
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
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <div>
                    <LabelStyle>Add Images</LabelStyle>
                    <UploadMultiFile
                      showPreview
                      maxSize={3145728}
                      accept="image/*"
                      files={values.imageUrl}
                      // onDrop={handleDrop}
                      onRemove={handleRemove}
                      onRemoveAll={handleRemoveAll}
                      error={Boolean(touched.imageUrl && errors.imageUrl)}
                    />
                    {touched.imageUrl && errors.imageUrl && (
                      <FormHelperText error sx={{ px: 2 }}>
                        {touched.imageUrl && errors.imageUrl}
                      </FormHelperText>
                    )}
                  </div>
                </Stack>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Coral' : 'Save Changes'}
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
