import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import { Card, CardHeader } from '@material-ui/core';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl from 'mapbox-gl';
import useLocales from 'hooks/useLocales';
import { useEffect, useRef, useState } from 'react';
import { dispatch, RootState, useSelector } from 'redux/store';
import { getListSites } from 'redux/slices/garden';
import { Site } from '../../../@types/garden';
import './Map.css';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------
const MapWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 0,
  height: 600,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none'
  }
}));

mapboxgl.accessToken = process.env.REACT_APP_MAP_MAPBOX || '';

// ----------------------------------------------------------------------

export default function AppMap() {
  const theme = useTheme();
  const { translate, currentLang } = useLocales();
  const mapContainerRef = useRef(null);
  const isLoading = useSelector((state: RootState) => state.garden.isLoading);
  const siteList = useSelector((state: RootState) => state.garden.siteList);
  const [lng, setLng] = useState(111.202);
  const [lat, setLat] = useState(11.305);
  const [zoomMap, setZoomMap] = useState(4.5);

  const fetchMap = () => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current || '',
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [lng, lat],
      zoom: zoomMap
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      placeholder: ''
    });
    map.addControl(geocoder);

    geocoder.setLanguage(currentLang.value);
    // add mapbox fullscreen
    map.addControl(new mapboxgl.FullscreenControl());
    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    const marker = new mapboxgl.Marker({ color: 'red' });
    if (siteList) {
      siteList.map((v: Site) => {
        marker
          .setLngLat([Number(v?.longitude), Number(v?.latitude)])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
              .setHTML(`<h3>${v.name}</h3><p>${v.address}</p>`)
          )
          .addTo(map);
      });
    }
  };

  useEffect(() => {
    dispatch(getListSites(0, -1));
  }, []);

  useEffect(() => {
    fetchMap();
  }, [siteList]);

  return (
    <Card>
      <MapWrapperStyle>
        <div>
          <div className="map-container" ref={mapContainerRef} />
        </div>
      </MapWrapperStyle>
    </Card>
  );
}
