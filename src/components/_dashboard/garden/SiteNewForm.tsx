import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect, useRef, lazy } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { styled as styled } from '@material-ui/core/styles';
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
  FormControlLabel,
  CardHeader,
  CardContent
} from '@material-ui/core';
// utils
import { OptionStatus, statusOptions } from 'utils/constants';
import { manageGarden } from '_apis_/garden';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import MapGL, { Source, Layer, MapEvent, MapRef, LayerProps } from 'react-map-gl';
import { MapMarkersPopups } from 'components/map';
// import { countries as COUNTRIES } from 'components/map/assets/countries';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Site } from '../../../@types/garden';
//
import { UploadAvatar } from '../../upload';
import { fData } from '../../../utils/formatNumber';
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
// const THEMES = {
//   streets: 'mapbox://styles/mapbox/streets-v11',
//   outdoors: 'mapbox://styles/mapbox/outdoors-v11',
//   light: 'mapbox://styles/mapbox/light-v10',
//   dark: 'mapbox://styles/mapbox/dark-v10',
//   satellite: 'mapbox://styles/mapbox/satellite-v9',
//   satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v11'
// };

// ----------------------------------------------------------------------

type SiteNewFormProps = {
  isEdit: boolean;
  currentSite?: Site;
};

mapboxgl.accessToken =
  'pk.eyJ1IjoiZGF0bmxtIiwiYSI6ImNsM2E3amtyaDAydzUzZHAxMTFtaWx4ZHcifQ.eLx8xZ0KfftAAekyFCVJEQ';

export default function SiteNewForm({ isEdit, currentSite }: SiteNewFormProps) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [gardenList, setGardenList] = useState([]);
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
  const [imageFILE, setImageFILE] = useState('');
  const mapContainerRef = useRef(null);
  const [lng, setLng] = useState(111.202);
  const [lat, setLat] = useState(11.305);
  const [zoomMap, setZoomMap] = useState(4.5);

  const NewGardenSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phone: Yup.string().required('Phone is required'),
    latitude: Yup.string().required('Latitude is required'),
    longitude: Yup.string().required('Longitude is required'),
    address: Yup.string().required('Address is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required')
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
          values.status = enumStatus!.id;
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
          enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', {
            variant: 'success'
          });
          navigate(PATH_DASHBOARD.site.list);
        } else {
          enqueueSnackbar(!isEdit ? 'Create error' : 'Update error', { variant: 'error' });
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
    setEnumStatus(statusOptions.find((e) => e.id == currentSite?.status) || null);
    setGardenList(currentSite?.listGarden);
  }, [currentSite]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current || '',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoomMap
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    const marker = new mapboxgl.Marker({ color: 'red' });
    marker.setLngLat([Number(currentSite?.longitude), Number(currentSite?.latitude)]).addTo(map);

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

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              {/* {isEdit && (
                <Label
                  color={values.status !== 'active' ? 'error' : 'success'}
                  sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
                >
                  {values.status}
                </Label>
              )} */}

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
                      Allowed *.jpeg, *.jpg, *.png, *.gif
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
                    label="Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <TextField
                    fullWidth
                    label="Address"
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Website"
                    {...getFieldProps('webUrl')}
                    error={Boolean(touched.webUrl && errors.webUrl)}
                    helperText={touched.webUrl && errors.webUrl}
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
                    label="Longitude"
                    {...getFieldProps('longitude')}
                    error={Boolean(touched.longitude && errors.longitude)}
                    helperText={touched.longitude && errors.longitude}
                  />
                  <TextField
                    fullWidth
                    label="Latitude"
                    {...getFieldProps('latitude')}
                    error={Boolean(touched.latitude && errors.latitude)}
                    helperText={touched.latitude && errors.latitude}
                  />
                </Stack>
                {isEdit && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <Autocomplete
                      fullWidth
                      multiple
                      id="tags-readOnly"
                      value={gardenList}
                      options={gardenList}
                      getOptionLabel={(option: any) => (option ? option.name : '')}
                      defaultValue={gardenList}
                      limitTags={2}
                      renderInput={(params) => (
                        <TextField {...params} label="Garden List" placeholder="Garden List" />
                      )}
                    />
                    <Autocomplete
                      fullWidth
                      disablePortal
                      clearIcon
                      id="status"
                      value={enumStatus}
                      options={statusOptions}
                      getOptionLabel={(option: OptionStatus) => option.label}
                      onChange={(e, values: OptionStatus | null) => setEnumStatus(values)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Status"
                          error={Boolean(touched.status && errors.status)}
                          helperText={touched.status && errors.status}
                        />
                      )}
                    />
                  </Stack>
                )}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Site' : 'Save Changes'}
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
