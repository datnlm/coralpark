import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
  Grid,
  Dialog,
  Button,
  Divider,
  TextField,
  DialogTitle,
  Stack,
  DialogContent,
  DialogActions,
  Autocomplete
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { RootState, useSelector } from 'redux/store';
import { useEffect } from 'react';
import { manageCell } from '_apis_/cell';
import useLocales from '../../../hooks/useLocales';
import { Cell } from '../../../@types/cell';
// ----------------------------------------------------------------------

type CreateCellNewFormProps = {
  open: boolean;
  onClose: any;
  currentCell?: Cell;
  isEdit: boolean;
};

export default function CreateCellNewForm({
  open,
  onClose,
  isEdit,
  currentCell
}: CreateCellNewFormProps) {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const cellTypeList = useSelector((state: RootState) => state.cell.cellTypeList);

  // const NewAddressSchema = Yup.object().shape({
  //   type: Yup.object().required(translate('message.form.cell')),
  //   acreage: Yup.string()
  //     .required()
  //     .matches(/^[0-9]+$/, translate('message.form.cell_typeError'))
  //     .min(10, translate('message.form.cell_length'))
  //     .max(10, translate('message.form.cell_length'))
  //     .required(translate('message.form.cell')),
  //   maxItem: Yup.string()
  //     .required()
  //     .matches(/^[0-9]+$/, translate('message.form.cell_typeError'))
  //     .min(10, translate('message.form.cell_length'))
  //     .max(10, translate('message.form.cell_length'))
  //     .required(translate('message.form.cell')),
  //   quantity: Yup.string()
  //     .required()
  //     .matches(/^[0-9]+$/, translate('message.form.cell_typeError'))
  //     .min(10, translate('message.form.cell_length'))
  //     .max(10, translate('message.form.cell_length'))
  //     .required(translate('message.form.cell'))
  // });

  const formik = useFormik({
    initialValues: {
      id: currentCell?.id || '',
      gardenId: currentCell?.gardenId || '',
      type: currentCell?.type || null,
      coralCellTypeId: currentCell?.coralCellTypeId || '',
      coralCellTypeName: currentCell?.coralCellTypeName || '',
      acreage: currentCell?.acreage || '',
      maxItem: currentCell?.maxItem || '',
      quantity: currentCell?.quantity || '',
      status: currentCell?.status || ''
    },
    // validationSchema: NewAddressSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        let flag = false;
        if (currentCell?.gardenId != null && currentCell?.id != null) {
          values.id = currentCell?.id;
          values.gardenId = currentCell?.gardenId;
          values.status = currentCell?.status;
          !isEdit
            ? await manageCell.createCell(values).then((response) => {
                if (response.status == 200) {
                  flag = true;
                }
              })
            : await manageCell.updateCell(values).then((response) => {
                if (response.status == 200) {
                  flag = true;
                }
              });
        }
        if (flag) {
          resetForm();
          setSubmitting(false);
          onClose(true);
          enqueueSnackbar(
            !isEdit ? translate('message.create-success') : translate('message.update-success'),
            { variant: 'success' }
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

  const { errors, values, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue } =
    formik;

  const fetchData = async () => {
    if (currentCell != null) {
      setFieldValue(
        'type',
        cellTypeList.find((v) => v.id == currentCell.type?.id)
      );
      setFieldValue('acreage', currentCell?.acreage);
      setFieldValue('maxItem', currentCell?.maxItem);
      setFieldValue('quantity', '1');
    }
  };

  useEffect(() => {
    if (isEdit) {
      fetchData();
    } else {
      setFieldValue('type', '');
      setFieldValue('acreage', '');
      setFieldValue('maxItem', '');
      setFieldValue('quantity', '');
    }
  }, [currentCell]);

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>Thêm mới Cell</DialogTitle>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3} direction="column">
              <Grid item>
                <Grid container spacing={2}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      clearIcon
                      id="type"
                      {...getFieldProps('type')}
                      options={cellTypeList}
                      getOptionLabel={(option: any) => (option ? option.name : '')}
                      // getOptionLabel={(option: any) => (option ? option.name : '')}
                      onChange={(e, values: any) =>
                        values ? { ...setFieldValue('type', values) } : null
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={translate('page.cell.form.type')}
                          error={Boolean(touched.type && errors.type)}
                          helperText={touched.type && errors.type}
                        />
                      )}
                    />

                    <TextField
                      fullWidth
                      label={translate('page.cell.form.acreage')}
                      {...getFieldProps('acreage')}
                    />
                    <TextField
                      fullWidth
                      label={translate('page.cell.form.items')}
                      {...getFieldProps('maxItem')}
                    />
                    <TextField
                      disabled={isEdit}
                      fullWidth
                      label={translate('page.cell.form.quantity')}
                      {...getFieldProps('quantity')}

                      // }}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>

          <Divider />

          <DialogActions>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {translate('button.save.confirm')}
            </LoadingButton>
            <Button type="button" color="inherit" variant="outlined" onClick={onClose}>
              {translate('button.save.cancel')}
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
}
