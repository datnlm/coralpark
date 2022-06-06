import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect, useRef } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { styled as styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import {
  Card,
  Box,
  Grid,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  FormHelperText,
  CardContent
} from '@material-ui/core';
// utils
import { OptionStatus, statusOptions } from 'utils/constants';
import { manageGarden } from '_apis_/garden';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import { RootState, useSelector } from 'redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hook
import useLocales from '../../../hooks/useLocales';
// @types
import { Site } from '../../../@types/garden';
//
import { UploadAvatar } from '../../upload';
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

export default function SiteNewForm({ isEdit, currentSite }: SiteNewFormProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const gardenList = useSelector((state: RootState) => state.garden.gardenList);
  const { enqueueSnackbar } = useSnackbar();
  const [imageFILE, setImageFILE] = useState('');
  const mapContainerRef = useRef(null);
  const [lng, setLng] = useState(111.202);
  const [lat, setLat] = useState(11.305);
  const [zoomMap, setZoomMap] = useState(4.5);

  const NewGardenSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phone: Yup.string()
      .required()
      .matches(/^[0-9]+$/, 'Phone must be only number')
      .min(10, 'Phone must be 10 number')
      .max(10, 'Phone must be 10 number')
      .required('Phone is required'),
    latitude: Yup.string().required('Latitude is required'),
    longitude: Yup.string().required('Longitude is required'),
    address: Yup.string().required('Address is required'),
    webUrl: Yup.string().matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Enter correct url!'
    ),
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
                    label={translate('page.site.form.longitude')}
                    {...getFieldProps('longitude')}
                    error={Boolean(touched.longitude && errors.longitude)}
                    helperText={touched.longitude && errors.longitude}
                  />
                  <TextField
                    fullWidth
                    label={translate('page.site.form.latitude')}
                    {...getFieldProps('latitude')}
                    error={Boolean(touched.latitude && errors.latitude)}
                    helperText={touched.latitude && errors.latitude}
                  />
                </Stack>
                {isEdit && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    {/* {gardenList && (
                      <Autocomplete
                        fullWidth
                        multiple
                        id="tags-readOnly"
                        {...getFieldProps('listGarden')}
                        options={currentSite?.listGarden}
                        getOptionLabel={(option: any) => (option ? option.name : '')}
                        defaultValue={currentSite?.listGarden}
                        limitTags={2}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={translate('page.site.form.garden-list')}
                            placeholder={translate('site.form.garden-list')}
                          />
                        )}
                      />
                    )} */}
                    <Autocomplete
                      fullWidth
                      disablePortal
                      clearIcon
                      id="status"
                      {...getFieldProps('status')}
                      options={statusOptions}
                      getOptionLabel={(option: OptionStatus) => option.label}
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
                )}
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
