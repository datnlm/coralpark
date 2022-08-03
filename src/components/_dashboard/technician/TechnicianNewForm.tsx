import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import plusFill from '@iconify/icons-eva/plus-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { manageTechnican } from '_apis_/technician';
// material
import { LoadingButton } from '@material-ui/lab';
import { useTheme } from '@material-ui/core/styles';
import {
  Card,
  Box,
  Grid,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  FormHelperText,
  CardHeader,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  CircularProgress,
  TableRow,
  Avatar,
  TablePagination,
  Button
} from '@material-ui/core';
// utils
import { OptionStatus, statusOptions } from 'utils/constants';
import { RootState, useSelector } from 'redux/store';
import Scrollbar from 'components/Scrollbar';
import Label from 'components/Label';
import SearchNotFound from 'components/SearchNotFound';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hook
import useLocales from '../../../hooks/useLocales';
// @types
import { Technician } from '../../../@types/technicians';
import { Area } from '../../../@types/area';
import { UploadAvatar } from '../../upload';
import { AreaListHead, AreaListToolbar, AreaMoreMenu } from '../area/list';
import TechnicianAreaNewForm from './TechnicianAreaNewForm';

// ----------------------------------------------------------------------

type TechnicianNewFormProps = {
  isEdit: boolean;
  currentTechnician?: Technician;
};

type Anonymous = Record<string | number, string>;

function descendingComparator(a: Anonymous, b: Anonymous, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function getComparator(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: Anonymous, b: Anonymous) => descendingComparator(a, b, orderBy)
    : (a: Anonymous, b: Anonymous) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array: Area[], comparator: (a: any, b: any) => number, query: string) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_garden) => _garden.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function TechnicianNewForm({ isEdit, currentTechnician }: TechnicianNewFormProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [selected, setSelected] = useState<string[]>([]);
  const [areaList, setAreaList] = useState<Area[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterName, setFilterName] = useState('');
  const [totalCount, setTotalCount] = useState<number>(0);
  const areaList2 = useSelector((state: RootState) => state.area.areaList);
  const isLoading = useSelector((state: RootState) => state.area.isLoading);
  const [imageFILE, setImageFILE] = useState('');
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
  const NewProductSchema = Yup.object().shape({
    name: Yup.string()
      .required(translate('message.form.name'))
      .min(3, translate('message.form.name_length_50'))
      .max(50, translate('message.form.name_length_50')),
    // username: Yup.string().required('Username is required'),
    phone: Yup.string()
      .required()
      .matches(/^[0-9]+$/, translate('message.form.phone_typeError'))
      .min(10, translate('message.form.phone_length'))
      .max(10, translate('message.form.phone_length'))
      .required(translate('message.form.phone')),
    email: Yup.string()
      .email(translate('message.form.email_invalid'))
      .required(translate('message.form.email')),
    address: Yup.string().required(translate('message.form.address'))
    // imageUrl: Yup.array().min(1, 'Images is required')
  });

  useEffect(() => {
    if (currentTechnician?.areas != null) {
      // currentTechnician.technicianAreas.map((v: any) => v.areaId == area.id)
      const listAreaId: number[] = [];
      currentTechnician?.areas.map((v: any) => listAreaId.push(v.areaId));
      setAreaList(areaList2.filter((area) => listAreaId.includes(Number(area.id))));
      setTotalCount(currentTechnician?.areas.length);
    }
    setEnumStatus(statusOptions.find((e) => e.id == currentTechnician?.status) || null);
  }, [currentTechnician]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentTechnician?.id || '',
      name: currentTechnician?.name || '',
      phone: currentTechnician?.phone || '',
      email: currentTechnician?.email || '',
      address: currentTechnician?.address || '',
      imageUrl: currentTechnician?.imageUrl || null,
      areas: currentTechnician?.areas || '',
      status: currentTechnician?.status || 1
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      let flag = false;
      try {
        const bodyFormData = new FormData();
        if (isEdit) {
          bodyFormData.append('id', values.id);
          values.status = enumStatus!.id;
        }
        bodyFormData.append('Name', values.name);
        bodyFormData.append('Phone', values.phone);
        bodyFormData.append('Email', values.email);
        bodyFormData.append('Address', values.address);
        bodyFormData.append('Status', values.status);
        bodyFormData.append('imageFile', imageFILE);

        !isEdit
          ? await manageTechnican.createTechnican(bodyFormData).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageTechnican.updateTechnican(bodyFormData).then((response) => {
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
          navigate(PATH_DASHBOARD.staff.listTechnician);
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

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  const handleDrop = useCallback(
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

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = areaList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const emptyRows = !isLoading && !areaList;
  const filteredArea = applySortFilter(
    currentTechnician?.areas ?? [],
    getComparator(order, orderBy),
    filterName
  );
  const isAreaNotFound = filteredArea.length === 0 && !isLoading;

  const TABLE_HEAD = [
    { id: 'name', label: translate('page.area.form.name'), alignRight: false },
    { id: 'address', label: translate('page.area.form.address'), alignRight: false },
    { id: '' }
  ];
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              <Box sx={{ mb: 5 }}>
                <UploadAvatar
                  accept="image/*"
                  file={values.imageUrl}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  error={Boolean(touched.imageUrl && errors.imageUrl)}
                  caption={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary'
                      }}
                    >
                      {translate('message.allow-type-image')}
                    </Typography>
                  }
                />
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.imageUrl && errors.imageUrl}
                </FormHelperText>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('page.technician.form.name')}
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label={translate('page.technician.form.phone')}
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('page.technician.form.email')}
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <TextField
                    fullWidth
                    label={translate('page.technician.form.address')}
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Stack>
                {isEdit && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      clearIcon
                      id="status"
                      value={enumStatus}
                      options={statusOptions}
                      getOptionLabel={(option: OptionStatus) => translate(`status.${option.label}`)}
                      // getOptionLabel={(option: any) => (option ? option.name : '')}
                      onChange={(e, values: OptionStatus | null) => setEnumStatus(values)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={translate('page.technician.form.status')}
                          error={Boolean(touched.status && errors.status)}
                          helperText={touched.status && errors.status}
                        />
                      )}
                    />
                  </Stack>
                )}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? translate('button.save.add') : translate('button.save.update')}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={12}>
            <Card>
              <Accordion key="1" disabled={!isEdit}>
                <AccordionSummary
                  expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}
                >
                  <Typography variant="subtitle1">
                    {translate('page.area.heading1.list')}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Card>
                    <Stack
                      direction={{ xs: 'row', sm: 'row' }}
                      spacing={{ xs: 3, sm: 2 }}
                      justifyContent="space-between"
                    >
                      <AreaListToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                      />
                      <CardHeader
                        sx={{ mb: 2 }}
                        action={
                          <Button
                            size="small"
                            onClick={handleClickOpen}
                            startIcon={<Icon icon={plusFill} />}
                          >
                            {translate('button.save.change')}
                          </Button>
                        }
                      />
                    </Stack>
                    <Scrollbar>
                      <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                          <AreaListHead
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={currentTechnician?.areas.length ?? 0}
                            numSelected={selected.length}
                            onRequestSort={handleRequestSort}
                            onSelectAllClick={handleSelectAllClick}
                          />
                          <TableBody>
                            {isLoading ? (
                              <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
                                <CircularProgress />
                              </TableCell>
                            ) : (
                              filteredArea
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                  const { id, name, address } = row;

                                  const isItemSelected = selected.indexOf(id) !== -1;

                                  return (
                                    <TableRow hover key={id} tabIndex={-1} role="checkbox">
                                      <TableCell padding="checkbox">
                                        {/* <Checkbox checked={isItemSelected} /> */}
                                      </TableCell>
                                      <TableCell align="left">{name}</TableCell>
                                      <TableCell align="left">{address}</TableCell>
                                      <TableCell align="right">
                                        <AreaMoreMenu onDelete={() => {}} areaId={id.toString()} />
                                      </TableCell>
                                    </TableRow>
                                  );
                                })
                            )}

                            {emptyRows && (
                              <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                  <Typography gutterBottom align="center" variant="subtitle1">
                                    {translate('message.not-found')}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                          {isAreaNotFound && (
                            <TableBody>
                              <TableRow>
                                <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                  <SearchNotFound searchQuery={filterName} />
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          )}
                        </Table>
                      </TableContainer>
                    </Scrollbar>

                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: translate('message.all'), value: -1 }
                      ]}
                      component="div"
                      count={totalCount}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={(e, page) => setPage(page)}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Card>
                </AccordionDetails>
              </Accordion>
            </Card>
          </Grid>
        </Grid>
      </Form>
      <TechnicianAreaNewForm
        currentTechnician={currentTechnician}
        areaList={areaList}
        open={open}
        onClose={handleClose}
        isEdit={isEdit}
      />
    </FormikProvider>
  );
}
