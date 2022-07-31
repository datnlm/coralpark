import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import { Card, Box, Grid, Stack, TextField, Typography, FormHelperText } from '@material-ui/core';
// utils
import { manageCell } from '_apis_/cell';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hook
import useLocales from '../../../hooks/useLocales';
// @types
import { CellType } from '../../../@types/cell-type';
//
import { QuillEditor } from '../../editor';
import { LivePreview, UploadMultiFile, UploadSingleFile } from '../../upload';
// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

type CellTypeNewFormProps = {
  isEdit: boolean;
  currentCellType?: CellType;
};

export default function CellTypeNewForm({ isEdit, currentCellType }: CellTypeNewFormProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [imageFILE, setImageFILE] = useState('');

  const NewGardenSchema = Yup.object().shape({
    name: Yup.string().required(translate('message.form.name'))
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentCellType?.id || '',
      name: currentCellType?.name || '',
      imageUrl: currentCellType?.imageUrl || '',
      description: currentCellType?.description || ''
    },
    validationSchema: NewGardenSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let flag = false;
        const bodyFormData = new FormData();
        if (isEdit) {
          bodyFormData.append('id', values.id);
        }
        bodyFormData.append('name', values.name);
        bodyFormData.append('description', values.description);
        bodyFormData.append('imageFile', imageFILE);
        !isEdit
          ? await manageCell.createCellType(bodyFormData).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageCell.updateCellType(bodyFormData).then((response) => {
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
          navigate(PATH_DASHBOARD.site.cellTypesList);
        } else {
          enqueueSnackbar(
            !isEdit ? translate('message.create-error') : translate('message.create-error'),
            { variant: 'error' }
          );
        }
      } catch (error) {
        enqueueSnackbar(
          !isEdit ? translate('message.create-error') : translate('message.create-error'),
          { variant: 'error' }
        );
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  const handleDropSingleFile = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImageFILE(file);
      if (file) {
        setFieldValue('imageUrl', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );

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
                    label={translate('page.cell-type.form.name')}
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Stack>
                {/* {img && (
                  <>
                    <LivePreview files={img} onRemove={handleRemoveImage} />
                  </>
                )} */}
                <div>
                  <LabelStyle>{translate('page.phase.form.image')}</LabelStyle>
                  <UploadSingleFile
                    maxSize={3145728}
                    accept="image/*"
                    file={values.imageUrl}
                    onDrop={handleDropSingleFile}
                    error={Boolean(touched.imageUrl && errors.imageUrl)}
                  />
                  {touched.imageUrl && errors.imageUrl && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {touched.imageUrl && errors.imageUrl}
                    </FormHelperText>
                  )}
                </div>
                <div>
                  <LabelStyle>{translate('page.cell-type.form.description')}</LabelStyle>
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
