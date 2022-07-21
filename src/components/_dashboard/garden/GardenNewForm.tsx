import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import plusFill from '@iconify/icons-eva/plus-fill';
import { styled } from '@material-ui/core/styles';
// material
import { LoadingButton, TabContext, TabList, TabPanel } from '@material-ui/lab';
import {
  Card,
  Box,
  Grid,
  Stack,
  TextField,
  Autocomplete,
  Button,
  Tab,
  CardHeader,
  CardContent,
  FormHelperText
} from '@material-ui/core';
// utils
import { manageGarden } from '_apis_/garden';
import { OptionStatus, statusOptions } from 'utils/constants';

import { RootState, useSelector, useDispatch } from 'redux/store';
import { Icon } from '@iconify/react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import './Map.css';
import * as turf from '@turf/turf';
import { mapConfig } from 'config';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hook
import useLocales from '../../../hooks/useLocales';
// @types
import { Garden } from '../../../@types/garden';
import CellList from '../../../pages/dashboard/CellList';
import CreateCellNewForm from '../cell/CreateCellNewForm';
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

type GardenNewFormProps = {
  isEdit: boolean;
  currentGarden?: Garden;
};

mapboxgl.accessToken = mapConfig || '';

export default function GardenNewForm({ isEdit, currentGarden }: GardenNewFormProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
  const dispatch = useDispatch();
  const [valueTab, setValueTab] = useState('0');
  const gardenTypesList = useSelector((state: RootState) => state.garden.gardenTypesList);
  const siteList = useSelector((state: RootState) => state.garden.siteList);
  const areaList = useSelector((state: RootState) => state.area.areaList);
  const [lng, setLng] = useState(111.202);
  const [lat, setLat] = useState(11.305);
  const mapContainerRef = useRef(null);
  const [polygonStr, setPolygonStr] = useState('');
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [zoomMap, setZoomMap] = useState(4.5);
  const NewGardenSchema = Yup.object().shape({
    name: Yup.string()
      .required(translate('message.form.name'))
      .min(3, translate('message.form.name_length_50'))
      .max(50, translate('message.form.name_length_50')),
    address: Yup.string().required(translate('message.form.address')),
    acreage: Yup.string()
      .required()
      .matches(/^[0-9]+$/, translate('message.form.acreage_typeError'))
      .required(translate('message.form.acreage')),
    quantityOfCells: Yup.string()
      .required()
      .matches(/^[0-9]+$/, translate('message.form.quantity_of_cells_typeError'))
      .required(translate('message.form.quantity_of_cells')),
    areaId: Yup.object().required(translate('message.form.area')),
    gardenTypeId: Yup.object().required(translate('message.form.garden_type')),
    siteId: Yup.object().required(translate('message.form.site'))
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentGarden?.id || '',
      name: currentGarden?.name || '',
      address: currentGarden?.address || '',
      acreage: currentGarden?.acreage || 0,
      quantityOfCells: currentGarden?.quantityOfCells || 0,
      areaId: currentGarden?.areaId || '',
      gardenTypeId: currentGarden?.gardenTypeId || '',
      siteId: currentGarden?.siteId || '',
      status: currentGarden?.status || '',
      wellKnownText: currentGarden?.wellKnownText || '',
      coralCells: currentGarden?.coralCells || ''
    },
    validationSchema: NewGardenSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let flag = false;
        values.areaId = values.areaId.id;
        values.siteId = values.siteId.id;
        values.gardenTypeId = values.gardenTypeId.id;
        polygonStr != ''
          ? (values.wellKnownText = polygonStr)
          : (values.wellKnownText = currentGarden?.wellKnownText || '');
        if (isEdit) {
          values.status = enumStatus!.id;
        }

        !isEdit
          ? await manageGarden.createGarden(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageGarden.updateGarden(values).then((response) => {
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
          navigate(PATH_DASHBOARD.garden.list);
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

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValueTab(newValue);
  };

  useEffect(() => {
    if (isEdit) {
      setFieldValue(
        'areaId',
        areaList.find((v) => v.id == currentGarden?.areaId)
      );
      setFieldValue(
        'gardenTypeId',
        gardenTypesList.find((v) => v.id == currentGarden?.gardenTypeId)
      );
      setFieldValue(
        'siteId',
        siteList.find((v) => v.id == currentGarden?.siteId)
      );
      setEnumStatus(statusOptions.find((v) => v.id == currentGarden?.status) || null);
    }
  }, [currentGarden]);

  useEffect(() => {
    if (isEdit && currentGarden) {
      setFieldValue('wellKnownText', currentGarden?.wellKnownText);
      const mapPoly = currentGarden?.wellKnownText
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
    }
  }, [currentGarden]);

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
      const area = turf.area(draw.getAll());
      const rounded_area = Math.round(area * 100) / 100;
      setFieldValue('acreage', rounded_area);
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
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={valueTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
            <Tab label={translate('page.garden.form.label.information')} value="0" />
            <Tab label={translate('page.garden.form.label.cell')} value="1" disabled={!isEdit} />
          </TabList>
        </Box>
        <TabPanel sx={{ p: 3 }} value="0">
          <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField
                          fullWidth
                          label={translate('page.garden.form.name')}
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                        <TextField
                          fullWidth
                          label={translate('page.garden.form.address')}
                          {...getFieldProps('address')}
                          error={Boolean(touched.address && errors.address)}
                          helperText={touched.address && errors.address}
                        />
                      </Stack>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <TextField
                          fullWidth
                          label={translate('page.garden.form.acreage')}
                          {...getFieldProps('acreage')}
                          error={Boolean(touched.acreage && errors.acreage)}
                          helperText={touched.acreage && errors.acreage}
                        />
                        <TextField
                          fullWidth
                          disabled
                          label={translate('page.garden.form.quantity-of-cells')}
                          {...getFieldProps('quantityOfCells')}
                          // InputProps={{
                          //   endAdornment: (
                          //     <InputAdornment position="end">
                          //       <IconButton edge="end">
                          //         {/* <IconButton onClick={handleClickOpen} edge="end"> */}
                          //         <Icon icon={plusFill} />
                          //       </IconButton>
                          //     </InputAdornment>
                          //   )
                          // }}
                          error={Boolean(touched.quantityOfCells && errors.quantityOfCells)}
                          helperText={touched.quantityOfCells && errors.quantityOfCells}
                        />
                      </Stack>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <Autocomplete
                          fullWidth
                          disablePortal
                          clearIcon
                          id="areaId"
                          {...getFieldProps('areaId')}
                          options={areaList}
                          getOptionLabel={(option: any) => (option ? option.name : '')}
                          onChange={(e, value: any) =>
                            value ? { ...setFieldValue('areaId', value) } : ''
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={translate('page.garden.form.area')}
                              error={Boolean(touched.areaId && errors.areaId)}
                              helperText={touched.areaId && errors.areaId}
                            />
                          )}
                        />

                        <Autocomplete
                          fullWidth
                          disablePortal
                          clearIcon
                          id="gardenTypeId"
                          {...getFieldProps('gardenTypeId')}
                          options={gardenTypesList}
                          getOptionLabel={(option: any) => (option ? option.name : '')}
                          onChange={(e, value: any) =>
                            value ? { ...setFieldValue('gardenTypeId', value) } : null
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={translate('page.garden.form.garden-type')}
                              error={Boolean(touched.gardenTypeId && errors.gardenTypeId)}
                              helperText={touched.gardenTypeId && errors.gardenTypeId}
                            />
                          )}
                        />
                      </Stack>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <Autocomplete
                          fullWidth
                          disablePortal
                          clearIcon
                          id="sites"
                          {...getFieldProps('siteId')}
                          options={siteList}
                          getOptionLabel={(option: any) => (option ? option.name : '')}
                          onChange={(e, value: any) =>
                            value ? { ...setFieldValue('siteId', value) } : ''
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={translate('page.garden.form.site')}
                              error={Boolean(touched.siteId && errors.siteId)}
                              helperText={touched.siteId && errors.siteId}
                            />
                          )}
                        />
                        {isEdit && (
                          <Autocomplete
                            fullWidth
                            disablePortal
                            clearIcon
                            id="status"
                            value={enumStatus}
                            options={statusOptions}
                            getOptionLabel={(option: OptionStatus) =>
                              translate(`status.${option.label}`)
                            }
                            // getOptionLabel={(option: any) => (option ? option.name : '')}
                            onChange={(e, values: OptionStatus | null) => setEnumStatus(values)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={translate('page.garden.form.status')}
                                error={Boolean(touched.status && errors.status)}
                                helperText={touched.status && errors.status}
                              />
                            )}
                          />
                        )}
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
        </TabPanel>
        <TabPanel sx={{ p: 3 }} value="1">
          <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Grid item xs={12} md={12}>
                    <Stack spacing={5}>
                      <CellList gardenId={currentGarden?.id} />
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
