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
import { mapConfig } from 'config';
import { getListSites } from 'redux/slices/garden';
import { MapMarkersPopups } from 'components/map';
import faker from 'faker';
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

const THEMES = {
  streets: 'mapbox://styles/mapbox/streets-v11',
  outdoors: 'mapbox://styles/mapbox/outdoors-v11',
  light: 'mapbox://styles/mapbox/light-v10',
  dark: 'mapbox://styles/mapbox/dark-v10',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v11'
};

mapboxgl.accessToken = process.env.REACT_APP_MAP_MAPBOX || '';

// ----------------------------------------------------------------------
// id: string;
// name: string;
// imageUrl: string;
// createTime: any;
// phone: string;
// email: string;
// address: string;
// webUrl: string;
// latitude: string;
// longitude: string;
// status: any;
// listGarden: any;
// }

type SiteMarker = { latlng: number[]; name: string; photo: string; address: string; phone: string };
const fakeData: { latlng: number[]; name: string; photo: string }[] = [];
const countries = [
  {
    timezones: ['America/Aruba'],
    latlng: [12.5, -69.96666666],
    name: 'Aruba',
    country_code: 'AW',
    capital: 'Oranjestad',
    photo: faker.image.image()
  },
  {
    timezones: ['Asia/Kabul'],
    latlng: [33, 65],
    name: 'Afghanistan',
    country_code: 'AF',
    capital: 'Kabul',
    photo: faker.image.image()
  },
  {
    timezones: ['Africa/Luanda'],
    latlng: [-12.5, 18.5],
    name: 'Angola',
    country_code: 'AO',
    capital: 'Luanda',
    photo: faker.image.image()
  },
  {
    timezones: ['Pacific/Efate'],
    latlng: [-16, 167],
    name: 'Vanuatu',
    country_code: 'VU',
    capital: 'Port Vila',
    photo: faker.image.image()
  },
  {
    timezones: ['Pacific/Wallis'],
    latlng: [-13.3, -176.2],
    name: 'Wallis and Futuna',
    country_code: 'WF',
    capital: 'Mata-Utu',
    photo: faker.image.image()
  },
  {
    timezones: ['Pacific/Apia'],
    latlng: [-13.58333333, -172.33333333],
    name: 'Samoa',
    country_code: 'WS',
    capital: 'Apia',
    photo: faker.image.image()
  },
  {
    timezones: ['Asia/Aden'],
    latlng: [15, 48],
    name: 'Yemen',
    country_code: 'YE',
    capital: "Sana'a",
    photo: faker.image.image()
  },
  {
    timezones: ['Africa/Johannesburg'],
    latlng: [-29, 24],
    name: 'South Africa',
    country_code: 'ZA',
    capital: 'Pretoria',
    photo: faker.image.image()
  },
  {
    timezones: ['Africa/Lusaka'],
    latlng: [-15, 30],
    name: 'Zambia',
    country_code: 'ZM',
    capital: 'Lusaka',
    photo: faker.image.image()
  },
  {
    timezones: ['Africa/Harare'],
    latlng: [-20, 30],
    name: 'Zimbabwe',
    country_code: 'ZW',
    capital: 'Harare',
    photo: faker.image.image()
  }
];

export default function AppMap() {
  const theme = useTheme();
  const { translate, currentLang } = useLocales();
  const mapContainerRef = useRef(null);
  const isLoading = useSelector((state: RootState) => state.garden.isLoading);
  const siteList = useSelector((state: RootState) => state.garden.siteList);
  const [sites, setSites] = useState<SiteMarker[]>([]);
  const [lng, setLng] = useState(111.202);
  const [lat, setLat] = useState(11.305);
  const [zoomMap, setZoomMap] = useState(4.5);

  const fetchMap = () => {
    const data: SiteMarker[] = [];
    siteList.map((v: Site) => {
      const latlngTmp = [];
      latlngTmp.push(Number(v.latitude));
      latlngTmp.push(Number(v.longitude));
      data.push({
        latlng: latlngTmp,
        name: v.name,
        photo: v.imageUrl,
        address: v.address,
        phone: v.phone
      });
      // data.push({ latlng: latlngTmp, name: v.name, photo: v.imageUrl });
    });
    setSites(data);
    console.log(countries);
    // const map = new mapboxgl.Map({
    //   container: mapContainerRef.current || '',
    //   style: 'mapbox://styles/mapbox/satellite-v9',
    //   center: [lng, lat],
    //   zoom: zoomMap
    // });
    // const geocoder = new MapboxGeocoder({
    //   accessToken: mapboxgl.accessToken,
    //   placeholder: ''
    // });
    // map.addControl(geocoder);
    // geocoder.setLanguage(currentLang.value);
    // // add mapbox fullscreen
    // map.addControl(new mapboxgl.FullscreenControl());
    // // Add navigation control (the +/- zoom buttons)
    // map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    // const marker = new mapboxgl.Marker({ color: 'red' });
    // if (siteList) {
    //   siteList.map((v: Site) => {
    //     marker
    //       .setLngLat([Number(v?.longitude), Number(v?.latitude)])
    //       .setPopup(
    //         new mapboxgl.Popup({ offset: 25 }) // add popups
    //           .setHTML(`<h3>${v.name}</h3><p>${v.address}</p>`)
    //       )
    //       .addTo(map);
    //   });
    // }
  };

  useEffect(() => {
    dispatch(getListSites(0, -1));
  }, []);

  useEffect(() => {
    fetchMap();
  }, [siteList]);

  const baseSettings = {
    mapboxApiAccessToken: mapConfig,
    width: '100%',
    height: '100%',
    minZoom: 1
  };

  return (
    <Card>
      {/* <MapWrapperStyle>
        <div>
          <div className="map-container" ref={mapContainerRef} />
        </div>
      </MapWrapperStyle> */}
      <Card>
        <MapWrapperStyle>
          <MapMarkersPopups {...baseSettings} data={sites} mapStyle={THEMES.light} />
        </MapWrapperStyle>
      </Card>
    </Card>
  );
}
