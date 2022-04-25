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
import GardenTypeNewForm from '../../components/_dashboard/garden/GardenTypeNewForm';
import { UserManager, Coral } from '../../@types/user';
// ----------------------------------------------------------------------

export default function GardenCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { gardenTypesList } = useSelector((state: RootState) => state.garden);
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  // const currentGardenType = gardenTypesList.find(
  //   (gardenType) => paramCase(gardenType.name) === name
  // );
  const [currentGardenType, setcurrentGardenType] = useState({
    id: 'string',
    name: 'string',
    description: 'string'
  });

  useEffect(() => {
    // dispatch(getUserList());
    console.log('do day');
    if (isEdit) {
      manageGarden.getGardenTypeByID(paramCase(name)).then((response) => {
        setcurrentGardenType(response.data.items);
      });
    }
  }, [dispatch]);

  return (
    <Page title="Garden: Garden a new list">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new garden type' : 'Edit coral'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Garden', href: PATH_DASHBOARD.garden.root },
            { name: !isEdit ? 'New type garden' : name }
          ]}
        />

        <GardenTypeNewForm isEdit={isEdit} currentGardenType={currentGardenType} />
      </Container>
    </Page>
  );
}
