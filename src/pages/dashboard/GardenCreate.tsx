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
import GardenNewForm from '../../components/_dashboard/garden/GardenNewForm';
// ----------------------------------------------------------------------

export default function GardenCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { gardenList } = useSelector((state: RootState) => state.garden);
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  // const currentGarden = gardenList.find((garden) => paramCase(garden.name) === name);
  const [currentGarden, setcurrentGarden] = useState({
    id: '',
    name: '',
    latitude: '',
    longitude: '',
    address: '',
    acreage: '',
    quantityOfCells: '',
    areaID: '',
    gardenTypeId: '',
    siteId: '',
    status: 0
  });

  useEffect(() => {
    if (isEdit) {
      manageGarden.getGardenByID(paramCase(name)).then((response) => {
        if (response.status == 200) {
          const data = {
            id: response.data.id,
            name: response.data.name,
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            address: response.data.address,
            acreage: response.data.acreage,
            quantityOfCells: response.data.quantityOfCells,
            areaID: response.data.area,
            gardenTypeId: response.data.gardenType,
            siteId: response.data.site,
            status: response.data.status
          };
          setcurrentGarden(data);
        }
      });
    }
  }, [dispatch]);

  return (
    <Page title="Garden: Garden a new list">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new garden' : 'Edit garden'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Garden', href: PATH_DASHBOARD.garden.root },
            { name: !isEdit ? 'New garden' : name }
          ]}
        />

        <GardenNewForm isEdit={isEdit} currentGarden={currentGarden} />
      </Container>
    </Page>
  );
}
