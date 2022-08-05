import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import { manageCoral } from '_apis_/coral';
import CoralHealthNewFrom from 'components/_dashboard/coral/CoralHealthNewForm';
import { CoralHealth, CoralType } from '../../@types/coral';
// redux
import { useDispatch } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useLocales from '../../hooks/useLocales';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

export default function CoralHealthCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const isEdit = pathname.includes('edit');

  const [currentHealth, setCurrentHealth] = useState<CoralHealth | null>(null);

  const fetchData = async () => {
    await manageCoral.getCoralHealthByID(paramCase(name)).then((response) => {
      if (response.status == 200) {
        const data = {
          id: response.data.id,
          name: response.data.name,
          description: response.data.description
        };
        setCurrentHealth(data);
      }
    });
  };

  useEffect(() => {
    if (isEdit) {
      fetchData();
    }
  }, [dispatch]);

  return (
    <Page
      title={
        !isEdit
          ? translate('page.coral-health.title.create')
          : translate('page.coral-health.title.update')
      }
    >
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={
            !isEdit
              ? translate('page.coral-health.heading1.create')
              : translate('page.coral-health.heading1.update')
          }
          links={[
            { name: translate('page.coral-health.heading2'), href: PATH_DASHBOARD.root },
            {
              name: translate('page.coral-health.heading3'),
              href: PATH_DASHBOARD.coral.listHealth
            },
            { name: !isEdit ? translate('page.coral-health.heading4.new') : name }
          ]}
        />
        <CoralHealthNewFrom isEdit={isEdit} currentHealth={currentHealth} />
      </Container>
    </Page>
  );
}
