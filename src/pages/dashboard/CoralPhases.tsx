import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
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
import CoralPhasesNewForm from '../../components/_dashboard/coral/CoralPhasesNewForm';

// ----------------------------------------------------------------------

export default function PhasesCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { userList } = useSelector((state: RootState) => state.user);
  const isEdit = pathname.includes('edit');
  const currentUser = userList.find((user) => paramCase(user.name) === name);

  useEffect(() => {
    dispatch(getUserList());
  }, [dispatch]);

  return (
    <Page title="Coral: Create a new phases">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new phases' : 'Edit phases'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Phases', href: PATH_DASHBOARD.user.root },
            { name: !isEdit ? 'New phases' : name }
          ]}
        />
        <CoralPhasesNewForm isEdit={isEdit} />
      </Container>
    </Page>
  );
}
