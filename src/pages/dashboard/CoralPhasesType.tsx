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
import CoralPhasesTypeNewForm from '../../components/_dashboard/coral/CoralPhasesTypeNewForm';

// ----------------------------------------------------------------------

export default function PhasesTypeCreate() {
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
    <Page title={!isEdit ? 'Coral: Create a new phase type' : 'Coral: Edit phase type'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new phase type' : 'Edit phases type'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Phase Type', href: PATH_DASHBOARD.user.root },
            { name: !isEdit ? 'New type' : name }
          ]}
        />

        <CoralPhasesTypeNewForm isEdit={isEdit} />
      </Container>
    </Page>
  );
}
