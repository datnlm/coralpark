import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import { manageDiver } from '_apis_/diver';
// redux
import { useDispatch, useSelector, RootState } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useLocales from '../../hooks/useLocales';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import DiverNewForm from '../../components/_dashboard/diver/DiverNewForm';
import { Diver } from '../../@types/diver';

// ----------------------------------------------------------------------

export default function DiverCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  const [currentDiver, setCurrentDiver] = useState<Diver>();

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
          setCurrentDiver(data);
        }
      });
    }
  }, [dispatch]);

  return (
    <Page
      title={!isEdit ? translate('page.diver.title.create') : translate('page.diver.title.update')}
    >
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={
            !isEdit
              ? translate('page.diver.heading1.create')
              : translate('page.diver.heading1.update')
          }
          links={[
            { name: translate('page.diver.heading2'), href: PATH_DASHBOARD.root },
            { name: translate('page.diver.heading3'), href: PATH_DASHBOARD.diver.root },
            { name: !isEdit ? translate('page.diver.heading4.new') : name }
          ]}
        />
        <DiverNewForm isEdit={isEdit} currentDiver={currentDiver} />
      </Container>
    </Page>
  );
}
