import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import { Card, CardHeader } from '@material-ui/core';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl from 'mapbox-gl';
import useLocales from 'hooks/useLocales';
import { useEffect, useRef, useState } from 'react';

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
    // if (currentSite) {
    //   marker.setLngLat([Number(currentSite?.longitude), Number(currentSite?.latitude)]).addTo(map);
    // }
  };
  useEffect(() => {
    fetchMap();
  }, []);

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
