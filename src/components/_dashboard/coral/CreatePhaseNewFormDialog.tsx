import * as Yup from 'yup';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { styled } from '@material-ui/core/styles';
import {
  Grid,
  Dialog,
  Button,
  Divider,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  Card,
  Stack,
  Typography
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { manageCoral } from '_apis_/coral';
import { useDispatch } from 'redux/store';
import { getListCoralPhase } from '../../../redux/slices/coral';
import useLocales from '../../../hooks/useLocales';
// @types
import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';
// ----------------------------------------------------------------------
const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

type CreatePhaseNewFormDialogProps = {
  open: boolean;
  onClose: any;
};

export default function CreatePhaseNewFormDialog({ open, onClose }: CreatePhaseNewFormDialogProps) {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required(translate('message.form.name'))
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: '',
      description: '',
      imageUrl: []
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const bodyFormData = new FormData();
        bodyFormData.append('name', values.name);
        bodyFormData.append('description', values.description);
        values.imageUrl.map((file: File | string) => bodyFormData.append('imageFile', file));

        await manageCoral.createCoralPhases(bodyFormData).then((response) => {
          if (response.status === 200) {
            dispatch(getListCoralPhase(0, -1));
            resetForm();
            setSubmitting(false);
            enqueueSnackbar(translate('message.create-success'), {
              variant: 'success'
            });
            onClose(response.data);
          } else {
            enqueueSnackbar(translate('message.create-error'), { variant: 'error' });
          }
        });

        // navigate(PATH_DASHBOARD.phases.new);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        // setErrors(error);
      }
    }
  });

  const { errors, values, touched, isSubmitting, handleSubmit, setFieldValue, getFieldProps } =
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

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>{translate('page.phase.form.name')}</DialogTitle>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
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

                  <DialogActions>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      {translate('button.save.add')}
                    </LoadingButton>
                    <Button type="button" color="inherit" variant="outlined" onClick={onClose}>
                      {translate('button.save.cancel')}
                    </Button>
                  </DialogActions>
                </Stack>
              </Card>
            </Grid>
          </DialogContent>

          <Divider />
        </Form>
      </FormikProvider>
    </Dialog>
  );
}
