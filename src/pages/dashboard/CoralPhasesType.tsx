import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container, Paper, Stack } from '@material-ui/core';
import LinearAlternativeLabel from 'components/_dashboard/coral/LinearAlternativeLabel';
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
        <Stack spacing={5}>
          <Paper
            sx={{
              p: 3,
              width: '100%',
              boxShadow: (theme) => theme.customShadows.z8
            }}
          >
            <LinearAlternativeLabel />
          </Paper>
        </Stack>
      </Container>
    </Page>
  );
}
