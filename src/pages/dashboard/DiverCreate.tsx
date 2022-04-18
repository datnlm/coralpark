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
import DiverNewForm from '../../components/_dashboard/diver/DiverNewForm';
import { UserManager, Coral } from '../../@types/user';
// ----------------------------------------------------------------------

export default function DiverCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { diverList } = useSelector((state: RootState) => state.diver);
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  const currentDiver = diverList.find((diver) => paramCase(diver.name) === name);
  const [currrentDiver, setcurrrentDiver] = useState({
    id: 0,
    name: 'string',
    phone: 'string',
    email: 'string',
    address: 'string',
    status: 'string'
  });

  // useEffect(() => {
  //   dispatch(getUserList());
  //   manageCoral.getCoralByID(paramCase(name)).then((response) => {
  //     setcurrrentCoral(response.data);
  //     console.log(currrentCoral);
  //   });
  // }, [dispatch]);

  return (
    <Page title="Diver: Create a new list">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new diver' : 'Edit diver'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Diver', href: PATH_DASHBOARD.diver.root },
            { name: !isEdit ? 'New diver' : name }
          ]}
        />

        <DiverNewForm isEdit={isEdit} currentDiver={currentDiver} />
      </Container>
    </Page>
  );
}
