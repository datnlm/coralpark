import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
  Grid,
  Radio,
  Dialog,
  Button,
  Divider,
  Checkbox,
  TextField,
  RadioGroup,
  IconButton,
  DialogTitle,
  Stack,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Box,
  Typography,
  InputAdornment,
  Autocomplete
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { RootState, useSelector } from 'redux/store';
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
  //   receiver: Yup.string().required('Fullname is required'),
  //   phone: Yup.string().required('Phone is required'),
  //   address: Yup.string().required('Address is required'),
  //   city: Yup.string().required('City is required'),
  //   state: Yup.string().required('State is required'),
  //   country: Yup.string().required('State is required')
  // });

  const formik = useFormik({
    initialValues: {
      id: currentCell?.id || '',
      gardenId: currentCell?.gardenId || '',
      type: currentCell?.type,
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
        if (currentCell?.gardenId != '') {
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
            !isEdit ? translate('message.create-error') : translate('message.create-error'),
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

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
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
                          label="{translate('page.garden.form.cell-type')}"
                          error={Boolean(touched.type && errors.type)}
                          helperText={touched.type && errors.type}
                        />
                      )}
                    />
                    {/* <TextField
                      fullWidth
                      label="Cell Type"
                      // label="{translate('page.garden.form.cell-type')}"
                      {...getFieldProps('typeId')}
                    /> */}
                    <TextField
                      fullWidth
                      label="Dien tich"
                      // label="{translate('page.coral-habitat.form.temperature')}"
                      {...getFieldProps('acreage')}
                    />
                    <TextField
                      fullWidth
                      label="max item"
                      // label="{translate('page.coral-habitat.form.temperature')}"
                      {...getFieldProps('maxItem')}
                    />
                    <TextField
                      fullWidth
                      label="quantity"
                      // label="{translate('page.garden.form.quantity')}"
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
