import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { manageArea } from '_apis_/area';
// material
import { Container } from '@material-ui/core';
import { Area } from '../../@types/area';
// redux
import { useDispatch } from '../../redux/store';
import { getListArea } from '../../redux/slices/area';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useLocales from '../../hooks/useLocales';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import AreaNewForm from '../../components/_dashboard/area/AreaNewForm';

// ----------------------------------------------------------------------

export default function AreaCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const isEdit = pathname.includes('edit');
  const [currentArea, setCurrentArea] = useState<Area>();

  const fetchData = async () => {
    await manageArea.getAreaById(paramCase(name)).then((response) => {
      setCurrentArea(response.data);
      console.log(response.data);
    });
  };

  useEffect(() => {
    if (isEdit) {
      fetchData();
    }
  }, [dispatch]);

  return (
    <Page
      title={!isEdit ? translate('page.area.title.create') : translate('page.area.title.update')}
    >
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={
            !isEdit
              ? translate('page.area.heading1.create')
              : translate('page.area.heading1.update')
          }
          links={[
            { name: translate('page.area.heading2'), href: PATH_DASHBOARD.root },
            {
              name: translate('page.area.heading3'),
              href: PATH_DASHBOARD.area.root
            },
            { name: !isEdit ? translate('page.area.heading4.new') : name }
          ]}
        />
        <AreaNewForm isEdit={isEdit} currentArea={currentArea} />
      </Container>
    </Page>
  );
}
