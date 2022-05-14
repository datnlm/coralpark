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
import GardenOwnerNewForm from '../../components/_dashboard/garden/GardenOwnerNewForm';
// ----------------------------------------------------------------------

export default function GardenCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { gardenOwnersList } = useSelector((state: RootState) => state.garden);
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  // const currentGardenOwner = gardenOwnersList.find((garden) => paramCase(garden.name) === name);
  const [currentGardenOwner, setcurrentGardenOwner] = useState({
    id: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (isEdit) {
      manageGarden.getGardenOwnerByID(paramCase(name)).then((response) => {
        if (response.status == 200) {
          const data = {
            id: response.data.id,
            name: response.data.name,
            phone: response.data.phone,
            email: response.data.email,
            address: response.data.address,
            imageUrl: response.data.imageUrl
          };
          setcurrentGardenOwner(data);
        }
      });
    }
  }, [dispatch]);

  return (
    <Page title="Garden: Garden a new list">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new garden owner' : 'Edit garden owner'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Garden Owner', href: PATH_DASHBOARD.garden.root },
            { name: !isEdit ? 'New owner garden' : name }
          ]}
        />

        <GardenOwnerNewForm isEdit={isEdit} currentGardenOwner={currentGardenOwner} />
      </Container>
    </Page>
  );
}
