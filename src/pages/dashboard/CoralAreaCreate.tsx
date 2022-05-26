import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';

import CoralAreaNewForm from 'components/_dashboard/coral_area/CoralAreaNewForm';
import { manageCoral } from '_apis_/coral';

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
import { CoralArea } from '../../@types/coral';
// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const isEdit = pathname.includes('edit');
  const [currentCoralArea, setCurrentCoralArea] = useState<CoralArea>();

  const fetchData = async () => {
    if (isEdit) {
      await manageCoral.getCoralByID(paramCase(name)).then((response) => {
        setCurrentCoralArea(response.data);
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  return (
    <Page title={!isEdit ? 'Coral Area: Create a new coral area' : 'Coral Area: Edit coral area'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new coral area' : 'Edit coral area'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Coral Area', href: PATH_DASHBOARD.user.root },
            { name: !isEdit ? 'New' : name }
          ]}
        />
        <CoralAreaNewForm isEdit={isEdit} currentCoralArea={currentCoralArea} />
      </Container>
    </Page>
  );
}
