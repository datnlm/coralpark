import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// coral api
import { manageCoral } from '_apis_/coral';
// material
import { Container } from '@material-ui/core';
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
import { UserManager, Coral } from '../../@types/user';
// ----------------------------------------------------------------------

export default function GardenCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { gardenList } = useSelector((state: RootState) => state.garden);
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  const currentGarden = gardenList.find((garden) => paramCase(garden.name) === name);
  // const [currrentCoral, setcurrrentCoral] = useState({
  //   id: 0,
  //   name: 'string',
  //   imageUrl: 'string',
  //   scientificName: 'string',
  //   longevity: 0,
  //   exhibitSocial: 'string',
  //   sexualBehaviors: 'string',
  //   nutrition: 'string',
  //   colour: 'string',
  //   description: 'string',
  //   coralTypeId: 0,
  //   status: 0,
  //   statusEnum: 'string',
  //   className: 'string',
  //   orderName: 'string',
  //   familyName: 'string',
  //   genusName: 'string',
  //   speciesName: 'string'
  // });

  // useEffect(() => {
  //   dispatch(getUserList());
  //   manageCoral.getCoralByID(paramCase(name)).then((response) => {
  //     setcurrrentCoral(response.data);
  //     console.log(currrentCoral);
  //   });
  // }, [dispatch]);

  return (
    <Page title="Garden: Garden a new list">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new garden' : 'Edit coral'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Garden', href: PATH_DASHBOARD.garden.root },
            { name: !isEdit ? 'New garden' : name }
          ]}
        />

        <GardenNewForm isEdit={isEdit} currentGarden={currentGarden} />
        {/* <GardenNewForm isEdit={isEdit} currentCoral={currrentCoral} /> */}
      </Container>
    </Page>
  );
}
