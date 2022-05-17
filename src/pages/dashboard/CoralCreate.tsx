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
import CoralNewForm from '../../components/_dashboard/coral/CoralNewForm';
import { UserManager, Coral } from '../../@types/user';
// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { userList } = useSelector((state: RootState) => state.user);
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  const currentUser = userList.find((user) => paramCase(user.name) === name);
  const [currentCoral, setCurrentCoral] = useState({
    id: 0,
    name: '',
    imageUrl: [],
    images: [],
    scientificName: '',
    longevity: '',
    exhibitSocial: '',
    sexualBehaviors: '',
    nutrition: '',
    colour: '',
    description: '',
    coralTypeId: '',
    statusEnum: ''
  });

  useEffect(() => {
    if (isEdit) {
      dispatch(getUserList());
      manageCoral.getCoralByID(paramCase(name)).then((response) => {
        setCurrentCoral(response.data);
        console.log(response.data);
      });
    }
  }, [dispatch]);

  return (
    <Page title="Coral: Create a new list">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new coral' : 'Edit coral'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Coral', href: PATH_DASHBOARD.coral.root },
            { name: !isEdit ? 'New coral' : name }
          ]}
        />

        <CoralNewForm isEdit={isEdit} currentCoral={currentCoral} />
      </Container>
    </Page>
  );
}
