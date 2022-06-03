import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
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
import CoralPhasesNewForm from '../../components/_dashboard/coral/CoralPhasesNewForm';

// ----------------------------------------------------------------------

export default function PhasesCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const isEdit = pathname.includes('edit');

  // useEffect(() => {}, [dispatch]);
  // chua sua coral phase list
  return (
    <Page
      title={
        !isEdit
          ? translate('page.coral-phase.title.create')
          : translate('page.coral-phase.title.update')
      }
    >
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={
            !isEdit
              ? translate('page.coral-phase.heading1.create')
              : translate('page.coral-phase.heading1.update')
          }
          links={[
            { name: translate('page.coral-phase.heading2'), href: PATH_DASHBOARD.root },
            { name: translate('page.coral-phase.heading3'), href: PATH_DASHBOARD.coral.list },
            { name: !isEdit ? translate('page.coral-phase.heading4.new') : name }
          ]}
        />
        <CoralPhasesNewForm isEdit={isEdit} />
      </Container>
    </Page>
  );
}
