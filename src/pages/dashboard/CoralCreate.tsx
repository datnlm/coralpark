import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// coral api
import { manageCoral } from '_apis_/coral';
// material
import { Container } from '@material-ui/core';
// redux
import { useDispatch, useSelector, RootState } from '../../redux/store';
import { getUserList } from '../../redux/slices/coral';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import CoralNewForm from '../../components/_dashboard/coral/CoralNewForm';
import { Coral, Habitat } from '../../@types/coral';
// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { userList } = useSelector((state: RootState) => state.user);
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  const currentUser = userList.find((user) => paramCase(user.name) === name);
  const [currentCoral, setCurrentCoral] = useState<Coral>();
  const [currentHabitat, setCurrentHabitat] = useState<Habitat | null>(null);

  const fetchData = async () => {
    if (isEdit) {
      await manageCoral.getCoralByID(paramCase(name)).then((response) => {
        setCurrentCoral(response.data);
      });
      await manageCoral.getHabitatByCoralId(paramCase(name)).then((response) => {
        setCurrentHabitat(response.data);
        console.log(response.data);
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  return (
    <Page title={!isEdit ? 'Coral: Create a new coral' : 'Coral: Edit coral'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new coral' : 'Edit coral'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Coral', href: PATH_DASHBOARD.coral.root },
            { name: !isEdit ? 'New coral' : name }
          ]}
        />

        <CoralNewForm isEdit={isEdit} currentCoral={currentCoral} currentHabitat={currentHabitat} />
      </Container>
    </Page>
  );
}
