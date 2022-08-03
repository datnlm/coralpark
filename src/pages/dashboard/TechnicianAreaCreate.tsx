import { useEffect } from 'react';
// material
import { Container } from '@material-ui/core';
import TechnicianAreaNewForm from 'components/_dashboard/technician/TechnicianAreaTransferList';
// redux
import { useDispatch } from '../../redux/store';
import { getListArea } from '../../redux/slices/area';
import { getListDiverTeam } from '../../redux/slices/diver';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useLocales from '../../hooks/useLocales';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// ----------------------------------------------------------------------

export default function TechnicianCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getListDiverTeam(0, -1));
    dispatch(getListArea(0, -1));
  }, [dispatch]);
  return (
    <Page title={translate('page.technician-area.title.create')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('page.technician-area.heading1.create')}
          links={[
            { name: translate('page.technician-area.heading2'), href: PATH_DASHBOARD.root },
            {
              name: translate('page.technician-area.heading3'),
              href: PATH_DASHBOARD.staff.technicianNew
            },
            { name: translate('page.technician-area.heading4.new') }
          ]}
        />
        {/* <TechnicianAreaNewForm /> */}
      </Container>
    </Page>
  );
}
