import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// coral api
import { manageCoral } from '_apis_/coral';
// material
import { Container } from '@material-ui/core';
import { manageGarden } from '_apis_/garden';
// redux
import { useDispatch, useSelector, RootState } from '../../redux/store';
import { getUserList } from '../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import SiteNewForm from '../../components/_dashboard/garden/SiteNewForm';
// ----------------------------------------------------------------------

export default function GardenCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { siteList } = useSelector((state: RootState) => state.garden);
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  // const currentGardenOwner = gardenOwnersList.find((garden) => paramCase(garden.name) === name);
  const [currentSite, setCurrentSite] = useState({
    id: '',
    name: '',
    imageUrl: '',
    createTime: '',
    phone: '',
    email: '',
    address: '',
    webUrl: '',
    latitude: '',
    longitude: '',
    status: ''
  });

  useEffect(() => {
    if (isEdit) {
      manageGarden.getSiteByID(paramCase(name)).then((response) => {
        if (response.status == 200) {
          const data = {
            id: response.data.id,
            name: response.data.name,
            imageUrl: response.data.imageUrl,
            createTime: response.data.createTime,
            phone: response.data.phone,
            email: response.data.email,
            address: response.data.address,
            webUrl: response.data.webUrl,
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            status: response.data.status
          };
          setCurrentSite(data);
        }
      });
    }
  }, [dispatch]);

  return (
    <Page title="Site: Site a new list">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new site' : 'Edit site'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Site', href: PATH_DASHBOARD.garden.root },
            { name: !isEdit ? 'New site' : name }
          ]}
        />
        <SiteNewForm isEdit={isEdit} currentSite={currentSite} />
      </Container>
    </Page>
  );
}
