import * as Yup from 'yup';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { useCallback, useState, useEffect, useRef } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@material-ui/lab';
import { styled as styled, useTheme } from '@material-ui/core/styles';
import {
  Card,
  Box,
  Grid,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  FormHelperText,
  CardContent,
  Container,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
  Table,
  CircularProgress,
  TablePagination,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core';
// utils
import { OptionStatus, statusOptions } from 'utils/constants';
import { manageGarden } from '_apis_/garden';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import { RootState, useSelector } from 'redux/store';
import Scrollbar from 'components/Scrollbar';
import SearchNotFound from 'components/SearchNotFound';
import Label from 'components/Label';
import Block from 'components/Block';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hook
import useSettings from '../../../hooks/useSettings';
import useLocales from '../../../hooks/useLocales';
// @types
import { Garden, Site } from '../../../@types/garden';
//
import { UploadAvatar } from '../../upload';
import { GardenListHead, GardenListToolbar, GardenMoreMenu } from './list';

// ----------------------------------------------------------------------

const MapWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 0,
  height: 560,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none'
  }
}));

// ----------------------------------------------------------------------

type SiteNewFormProps = {
  isEdit: boolean;
  currentSite?: Site;
};
mapboxgl.accessToken = process.env.REACT_APP_MAP_MAPBOX || '';

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

function applySortFilter(array: Garden[], comparator: (a: any, b: any) => number, query: string) {
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

export default function SiteNewForm({ isEdit, currentSite }: SiteNewFormProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const [selected, setSelected] = useState<string[]>([]);
  const [gardenList, setGardenList] = useState<Garden[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const isLoading = useSelector((state: RootState) => state.garden.isLoading);
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [imageFILE, setImageFILE] = useState('');
  const mapContainerRef = useRef(null);
  const [lng, setLng] = useState(111.202);
  const [lat, setLat] = useState(11.305);
  const [zoomMap, setZoomMap] = useState(4.5);

  const NewGardenSchema = Yup.object().shape({
    name: Yup.string()
      .required(translate('message.form.name'))
      .min(3, translate('message.form.name_length_50'))
      .max(50, translate('message.form.name_length_50')),
    phone: Yup.string()
      .required()
      .matches(/^[0-9]+$/, translate('message.form.phone_typeError'))
      .min(10, translate('message.form.phone_length'))
      .max(10, translate('message.form.phone_length'))
      .required(translate('message.form.phone')),
    latitude: Yup.string().required(translate('message.form.latitude')),
    longitude: Yup.string().required(translate('message.form.longitude')),
    address: Yup.string().required(translate('message.form.address')),
    webUrl: Yup.string().matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      translate('message.form.web_typeError')
    ),
    email: Yup.string()
      .email(translate('message.form.email_invalid'))
      .required(translate('message.form.email'))
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentSite?.id || '',
      name: currentSite?.name || '',
      imageUrl: currentSite?.imageUrl || '',
      createTime: currentSite?.createTime || '',
      phone: currentSite?.phone || '',
      email: currentSite?.email || '',
      address: currentSite?.address || '',
      webUrl: currentSite?.webUrl || '',
      latitude: currentSite?.latitude || '',
      longitude: currentSite?.longitude || '',
      status: currentSite?.status || '',
      listGarden: currentSite?.listGarden || ''
    },
    validationSchema: NewGardenSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let flag = false;
        const bodyFormData = new FormData();
        if (isEdit) {
          bodyFormData.append('id', values.id);
          values.status = values.status.id;
        }
        bodyFormData.append('Name', values.name);
        bodyFormData.append('Phone', values.phone);
        bodyFormData.append('Email', values.email);
        bodyFormData.append('Address', values.address);
        bodyFormData.append('WebUrl', values.webUrl);
        bodyFormData.append('Latitude', values.latitude);
        bodyFormData.append('Longitude', values.longitude);
        bodyFormData.append('Status', values.status);
        // bodyFormData.append('ListGarden', values.address);
        bodyFormData.append('imageFile', imageFILE);
        !isEdit
          ? await manageGarden.createSite(bodyFormData).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageGarden.updateSite(bodyFormData).then((response) => {
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
          navigate(PATH_DASHBOARD.site.list);
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

  useEffect(() => {
    if (isEdit) {
      setFieldValue('listGarden', currentSite?.listGarden);
      if (currentSite?.listGarden != null) {
        setGardenList(currentSite?.listGarden);
        setTotalCount(currentSite?.listGarden.length);
      }
      setFieldValue(
        'status',
        statusOptions.find((v) => v.id == currentSite?.status)
      );
    }
  }, [currentSite]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current || '',
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [lng, lat],
      zoom: zoomMap
    });

    // add mapbox fullscreen
    map.addControl(new mapboxgl.FullscreenControl());
    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    const marker = new mapboxgl.Marker({ color: 'red' });
    if (currentSite) {
      marker.setLngLat([Number(currentSite?.longitude), Number(currentSite?.latitude)]).addTo(map);
    }

    map.on('click', (e) => {
      marker.remove();
      setZoomMap(Number(map.getZoom().toFixed(2)));
      marker.setLngLat(e.lngLat).addTo(map);

      setLng(e.lngLat.lng);
      setLat(e.lngLat.lat);
      setFieldValue('longitude', e.lngLat.lng);
      setFieldValue('latitude', e.lngLat.lat);
    });
  }, [currentSite]); // eslint-disable-line react-hooks/exhaustive-deps

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
      const newSelecteds = gardenList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const emptyRows = !isLoading && !gardenList;
  const filteredGarden = applySortFilter(gardenList, getComparator(order, orderBy), filterName);
  const isGardenNotFound = filteredGarden.length === 0 && !isLoading;

  const TABLE_HEAD = [
    { id: 'name', label: translate('page.garden.form.name'), alignRight: false },
    { id: 'address', label: translate('page.garden.form.address'), alignRight: false },
    { id: 'acreage', label: translate('page.garden.form.acreage'), alignRight: false },
    { id: 'quantity', label: translate('page.garden.form.quantity-of-cells'), alignRight: false },
    { id: 'status', label: translate('page.garden.form.status'), alignRight: false },
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
                    label={translate('page.site.form.name')}
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label={translate('page.site.form.phone')}
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('page.site.form.email')}
                    type="email"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <TextField
                    fullWidth
                    label={translate('page.site.form.address')}
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('page.site.form.website')}
                    {...getFieldProps('webUrl')}
                    error={Boolean(touched.webUrl && errors.webUrl)}
                    helperText={touched.webUrl && errors.webUrl}
                  />
                  <Autocomplete
                    fullWidth
                    disablePortal
                    clearIcon
                    id="status"
                    {...getFieldProps('status')}
                    options={statusOptions}
                    getOptionLabel={(option: OptionStatus) => translate(`status.${option.label}`)}
                    onChange={(e, values: any) =>
                      values ? { ...setFieldValue('status', values) } : null
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={translate('page.site.form.status')}
                        error={Boolean(touched.status && errors.status)}
                        helperText={touched.status && errors.status}
                      />
                    )}
                  />
                </Stack>
                <Grid item xs={12}>
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <MapWrapperStyle>
                        <div>
                          <div className="map-container" ref={mapContainerRef} />
                        </div>
                      </MapWrapperStyle>
                    </CardContent>
                  </Card>
                </Grid>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    disabled={true}
                    label={translate('page.site.form.longitude')}
                    {...getFieldProps('longitude')}
                    error={Boolean(touched.longitude && errors.longitude)}
                    helperText={touched.longitude && errors.longitude}
                  />
                  <TextField
                    fullWidth
                    disabled={true}
                    label={translate('page.site.form.latitude')}
                    {...getFieldProps('latitude')}
                    error={Boolean(touched.latitude && errors.latitude)}
                    helperText={touched.latitude && errors.latitude}
                  />
                </Stack>
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
                    {translate('page.garden.heading1.list')}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Card>
                    <GardenListToolbar
                      numSelected={selected.length}
                      filterName={filterName}
                      onFilterName={handleFilterByName}
                    />

                    <Scrollbar>
                      <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                          <GardenListHead
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={gardenList.length}
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
                              filteredGarden
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                  const { id, name, address, acreage, quantityOfCells, status } =
                                    row;

                                  return (
                                    <TableRow
                                      hover
                                      key={id}
                                      tabIndex={-1}
                                      role="checkbox"
                                      // selected={isItemSelected}
                                      // aria-checked={isItemSelected}
                                    >
                                      <TableCell padding="checkbox">
                                        {/* <Checkbox checked={isItemSelected} onClick={() => handleClick(name)} /> */}
                                      </TableCell>
                                      <TableCell component="th" scope="row" padding="none">
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                          {/* <Avatar alt={name} src={imageUrl} /> */}
                                          <Typography variant="subtitle2" noWrap>
                                            {name}
                                          </Typography>
                                        </Stack>
                                      </TableCell>
                                      <TableCell align="left">{address}</TableCell>
                                      <TableCell align="left">{acreage}</TableCell>
                                      <TableCell align="left">{quantityOfCells}</TableCell>
                                      <TableCell align="left">
                                        <Label
                                          variant={
                                            theme.palette.mode === 'light' ? 'ghost' : 'filled'
                                          }
                                          color={(status === 0 && 'error') || 'success'}
                                        >
                                          {translate(
                                            `status.${
                                              statusOptions.find((v: any) => v.id == status)?.label
                                            }`
                                          )}
                                        </Label>
                                      </TableCell>

                                      <TableCell align="right">
                                        <GardenMoreMenu
                                          onDelete={() => {}}
                                          userName={id.toString()}
                                          status={status}
                                        />
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
                          {isGardenNotFound && (
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
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
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
    </FormikProvider>
  );
}
