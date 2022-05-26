import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// coral api
import { manageCoral } from '_apis_/coral';
// material
import { Container } from '@material-ui/core';
import { manageDiver } from '_apis_/diver';
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
import DiverNewForm from '../../components/_dashboard/diver/DiverNewForm';

// ----------------------------------------------------------------------

export default function DiverCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { diverList } = useSelector((state: RootState) => state.diver);
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  const [currentDiver, setcurrentDiver] = useState({
    id: '',
    username: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    imageUrl: '',
    status: 0
  });

  useEffect(() => {
    if (isEdit) {
      manageDiver.getDiverByID(paramCase(name)).then((response) => {
        if (response.status == 200) {
          const data = {
            id: response.data.id,
            username: response.data.userName,
            name: response.data.name,
            phone: response.data.phone,
            email: response.data.email,
            address: response.data.address,
            password: response.data.password,
            imageUrl: response.data.imageUrl,
            status: response.data.status
          };
          setcurrentDiver(data);
        }
      });
    }
  }, [dispatch]);

  return (
    <Page title={!isEdit ? 'Diver: Create a new diver' : 'Diver: Edit diver'}>
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
