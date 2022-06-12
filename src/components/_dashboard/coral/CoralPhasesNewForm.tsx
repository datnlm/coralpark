import * as Yup from 'yup';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { manageCoral } from '_apis_/coral';
// material
import { styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
  FormHelperText,
  FormControlLabel,
  Autocomplete
} from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hook
import useLocales from '../../../hooks/useLocales';
// @types
import { Phases } from '../../../@types/coral';
import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';
import LivePreview from '../../upload/LivePreview';
// ----------------------------------------------------------------------

type CoralPhasesNewFormProps = {
  isEdit: boolean;
  currentPhases?: Phases;
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

export default function CoralPhasesNewForm({ isEdit, currentPhases }: CoralPhasesNewFormProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string()
      .required(translate('message.form.name'))
      .min(3, translate('message.form.name_length_100'))
      .max(100, translate('message.form.name_length_100')),
    imageUrl: Yup.array().min(1, translate('message.form.image'))
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentPhases?.id || '',
      name: currentPhases?.name || '',
      description: currentPhases?.description || '',
      imageUrl: currentPhases?.imageUrl || []
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let flag = false;
        const bodyFormData = new FormData();
        if (isEdit) {
          bodyFormData.append('id', values.id);
        }
        bodyFormData.append('name', values.name);
        bodyFormData.append('description', values.description);
        values.imageUrl.map((file: File | string) => bodyFormData.append('imageFile', file));
        !isEdit
          ? await manageCoral.createCoralPhases(bodyFormData).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageCoral.updateCoralPhases(bodyFormData).then((response) => {
              if (response.status == 200) {
                flag = true;
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
          navigate(PATH_DASHBOARD.phases.list);
        } else {
          enqueueSnackbar(
            !isEdit ? translate('message.create-error') : translate('message.update-error'),
            { variant: 'error' }
          );
        }
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        // setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFieldValue(
        'imageUrl',
        acceptedFiles.map((file: File | string) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    },
    [setFieldValue]
  );
  const handleRemoveAll = () => {
    setFieldValue('imageUrl', []);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = values.imageUrl.filter((_file) => _file !== file);
    setFieldValue('imageUrl', filteredItems);
  };

  const handleRemoveImage = (imageId: string) => {
    if (values.imageUrl) {
      setFieldValue('imageUrl', '');
    }
  };

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
                    label={translate('page.phase.form.name')}
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Stack>

                <div>
                  <LabelStyle>{translate('page.phase.form.description')}</LabelStyle>
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
                {/* {values.imageUrl && (
                  <>
                    <LivePreview files={values.imageUrl} onRemove={handleRemoveImage} />
                  </>
                )} */}
                <div>
                  <LabelStyle>{translate('page.phase.form.image')}</LabelStyle>
                  <UploadMultiFile
                    showPreview
                    maxSize={3145728}
                    accept="image/*"
                    files={values.imageUrl}
                    onDrop={handleDrop}
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
