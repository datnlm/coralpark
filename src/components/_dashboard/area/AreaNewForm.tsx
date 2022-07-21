import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { useState, useEffect, useRef } from 'react';
import { manageArea } from '_apis_/area';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import './Map.css';
// material
import { styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import {
  Card,
  Grid,
  Stack,
  TextField,
  Autocomplete,
  Box,
  CardContent,
  FormHelperText
} from '@material-ui/core';
import { mapConfig } from 'config';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import useLocales from '../../../hooks/useLocales';
// @types
import { Area } from '../../../@types/area';

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
type ProvinceAPI = {
  id: any;
  name: string;
  nameUnit: string;
};

type AreaNewFormProps = {
  isEdit: boolean;
  currentArea?: Area;
};

mapboxgl.accessToken = mapConfig || '';
// mapboxgl.accessToken = process.env.REACT_APP_MAP_MAPBOX || '';

export default function AreaNewForm({ isEdit, currentArea }: AreaNewFormProps) {
  const { currentLang, translate } = useLocales();
  const [optionsProvince, setOptionsProvince] = useState([]);
  const [optionsDistrict, setOptionsDistrict] = useState([]);
  const [optionsWard, setOptionsWard] = useState([]);
  const [currentProvince, setCurrentProvince] = useState<any>(null);
  const [currentDistrict, setCurrentDistrict] = useState<any>(null);
  const [currentWard, setCurrentWard] = useState<any>(null);
  const [district, setDisctrict] = useState<any>();
  const [ward, setWard] = useState<any>();
  const [polygonStr, setPolygonStr] = useState('');
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const mapContainerRef = useRef(null);
  const [lng, setLng] = useState(111.202);
  const [lat, setLat] = useState(11.305);
  const [zoomMap, setZoomMap] = useState(4.5);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const NewProductSchema = Yup.object().shape({
    name: Yup.string()
      .required(translate('message.form.name'))
      .min(3, translate('message.form.name_length_50'))
      .max(50, translate('message.form.name_length_50')),
    wellKnownText: Yup.string().required(translate('message.form.area')),
    address: Yup.object().required(translate('message.form.province')).nullable(true)
  });

  const checkSelected = (provice: string) => {
    return (
      <option key={provice} value={provice}>
        {provice}
      </option>
    );
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentArea?.id || '',
      name: currentArea?.name || '',
      address: currentArea?.address || '',
      wellKnownText: currentArea?.wellKnownText || ''
    },
    validationSchema: NewProductSchema,

    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let result = currentProvince.name;
        if (currentDistrict != null) {
          result = currentDistrict.name.concat(', ', result);
        }
        if (currentWard != null) {
          result = currentWard.name.concat(', ', result);
        }

        values.address = result;
        polygonStr != ''
          ? (values.wellKnownText = polygonStr)
          : (values.wellKnownText = currentArea?.wellKnownText || '');

        let flag = false;
        !isEdit
          ? await manageArea.createArea(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageArea.updateArea(values).then((response) => {
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
          navigate(PATH_DASHBOARD.area.list);
        } else {
          enqueueSnackbar(
            !isEdit ? translate('message.create-error') : translate('message.create-error'),
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

  // set province combobox
  useEffect(() => {
    manageArea.getProvince('0').then((response) => {
      if (response.status == 200) {
        setOptionsProvince(response.data.items);
      } else {
        setOptionsProvince([]);
      }
    });
  }, []);

  useEffect(() => {
    if (!isEdit) {
      setCurrentDistrict(null);
      setOptionsDistrict([]);
      setCurrentWard(null);
      setOptionsWard([]);
    }

    if (currentProvince != null) {
      manageArea.getProvince(currentProvince.id.toString()).then((response) => {
        if (response.status == 200) {
          setOptionsDistrict(response.data.items);
          if (isEdit) {
            setCurrentDistrict(response.data.items.find((e: ProvinceAPI) => e.name == district));
          }
        } else {
          setOptionsDistrict([]);
        }
      });
    }
  }, [currentProvince]);

  useEffect(() => {
    if (!isEdit) {
      setCurrentWard(null);
      setOptionsWard([]);
    }
    if (currentDistrict != null) {
      manageArea.getProvince(currentDistrict.id.toString()).then((response) => {
        if (response.status == 200) {
          setOptionsWard(response.data.items);
          if (isEdit) {
            setCurrentWard(response.data.items.find((e: ProvinceAPI) => e.name == ward));
          }
        } else {
          setOptionsWard([]);
        }
      });
    }
  }, [currentDistrict]);

  // set value when edit
  useEffect(() => {
    if (isEdit && currentArea) {
      const addressArr = currentArea?.address.split(', ');
      const province = addressArr?.pop();
      const district = addressArr?.pop();
      const ward = addressArr?.pop();
      setFieldValue('wellKnownText', currentArea?.wellKnownText);
      const mapPoly = currentArea?.wellKnownText
        .replace('POLYGON', '')
        .replace('((', '')
        .replace('))', '')
        .split(',');
      const coordinatesTmp: any = [];
      mapPoly.map((v) => {
        const tmp: any = [];
        v.split(' ').map((lnglat) => tmp.push(lnglat));
        coordinatesTmp.push(tmp);
      });
      setPolygonCoordinates(coordinatesTmp);
      setDisctrict(district);
      setWard(ward);
      setCurrentProvince(optionsProvince.find((e: ProvinceAPI) => e.name == province));
    }
  }, [currentArea]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      // accessToken: mapboxgl.accessToken,
      container: mapContainerRef.current || '',
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [lng, lat],
      zoom: zoomMap
    });

    // polygon
    map.on('load', () => {
      // Add a data source containing GeoJSON data.
      map.addSource('maine', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              properties: {},
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [polygonCoordinates]
              }
            }
            // add point
          ]
        }
      });

      // Add a new layer to visualize the polygon.
      map.addLayer({
        id: 'maine',
        type: 'fill',
        source: 'maine', // reference the data source
        layout: {},
        paint: {
          'fill-color': '#0080ff', // blue color fill
          'fill-opacity': 0.5
        }
      });
      // Add a black outline around the polygon.
      map.addLayer({
        id: 'outline',
        type: 'line',
        source: 'maine',
        layout: {},
        paint: {
          'line-color': '#000',
          'line-width': 3
        }
      });
    });

    // const geocoder = new MapboxGeocoder({
    //   accessToken: mapboxgl.accessToken,
    //   placeholder: ''
    // });
    // geocoder.setLanguage(currentLang.value);
    // // Add the control to the map.
    // map.addControl(geocoder);

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        polygon: true,
        trash: true
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      defaultMode: 'draw_polygon'
    });
    // add mapbox fullscreen
    map.addControl(new mapboxgl.FullscreenControl());
    // add polygon
    map.addControl(draw);
    map.on('draw.create', getCoords);
    map.on('draw.delete', getCoords);
    map.on('draw.update', getCoords);

    function getCoords(e: any) {
      const data = draw.getAll();
      // console.log(data);
    }
    map.on('draw.create', updateArea);
    map.on('draw.delete', updateArea);
    map.on('draw.update', updateArea);

    function updateArea(e: any) {
      if (draw.getAll().features[0] != null) {
        const data = draw.getAll().features![0]!.geometry;
        let string = '';
        if (data.type === 'Polygon') {
          data!.coordinates.map((v) => {
            let str = '';
            v.map((values, index) => {
              str += `${values[0]} ${values[1]}`;
              // str += values.toString();
              if (index < v.length - 1) {
                str += ',';
              }
              // console.log(string + `(${values.toString()})`);
            });
            string = `POLYGON((${str}))`;
            // set polygonStr
            setPolygonStr(string);
            setFieldValue('wellKnownText', string);
          });
        } else {
          setPolygonStr('');
        }
      }
    }

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
  }, [polygonCoordinates]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, minHeight: 300 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('page.area.form.name')}
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <Autocomplete
                    fullWidth
                    disablePortal
                    clearIcon
                    id="province"
                    value={currentProvince}
                    options={optionsProvince}
                    getOptionLabel={(option: ProvinceAPI) => option.name}
                    onChange={(e, value: ProvinceAPI | null) => {
                      setCurrentProvince(value);
                      setFieldValue('address', value);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={translate('page.area.form.province')}
                        error={Boolean(touched.address && errors.address)}
                        helperText={touched.address && errors.address}
                      />
                    )}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    clearIcon
                    id="district"
                    value={currentDistrict}
                    options={optionsDistrict}
                    getOptionLabel={(option: ProvinceAPI) => option.name}
                    onChange={(e, value: ProvinceAPI | null) => setCurrentDistrict(value)}
                    renderInput={(params) => (
                      <TextField {...params} label={translate('page.area.form.district')} />
                    )}
                  />
                  <Autocomplete
                    fullWidth
                    disablePortal
                    clearIcon
                    id="ward"
                    value={currentWard}
                    options={optionsWard}
                    getOptionLabel={(option: ProvinceAPI) => option.name}
                    onChange={(e, value: ProvinceAPI | null) => setCurrentWard(value)}
                    renderInput={(params) => (
                      <TextField {...params} label={translate('page.area.form.ward')} />
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
                      {touched.wellKnownText && errors.wellKnownText && (
                        <FormHelperText error sx={{ px: 2 }}>
                          {touched.wellKnownText && errors.wellKnownText}
                        </FormHelperText>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
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
