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
// import CoralAreaNewForm from '../../components/_dashboard/user/CoralAreaNewForm';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { userList } = useSelector((state: RootState) => state.user);
  const isEdit = pathname.includes('edit');
  // const currentUser = userList.find((user) => paramCase(user.name) === name);

  useEffect(() => {
    dispatch(getUserList());
  }, [dispatch]);

  return (
    <Page title="Coral Area: Create a new list">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new coral area' : 'Edit coral area'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Coral Area', href: PATH_DASHBOARD.user.root },
            { name: !isEdit ? 'New coral area' : name }
          ]}
        />

        {/* <CoralAreaNewForm isEdit={isEdit} /> */}
      </Container>
    </Page>
  );
}
