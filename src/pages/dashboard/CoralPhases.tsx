import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
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
  // chua sua coral phase list
  return (
    <Page title={!isEdit ? 'Coral Phase: Create a new phase' : 'Coral Phase: Edit phase'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new phase' : 'Edit phases'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Coral Phase', href: PATH_DASHBOARD.coral.list },
            { name: !isEdit ? 'New phases' : name }
          ]}
        />
        <CoralPhasesNewForm isEdit={isEdit} />
      </Container>
    </Page>
  );
}
