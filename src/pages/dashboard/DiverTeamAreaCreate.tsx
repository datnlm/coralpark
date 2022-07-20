import { useEffect } from 'react';
// material
import { Container } from '@material-ui/core';

import DiverTeamAreaNewForm from 'components/_dashboard/diver/DiverTeamAreaNewForm';
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

export default function DiverTeamAreaCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getListDiverTeam(0, -1));
    dispatch(getListArea(0, -1));
  }, []);
  return (
    <Page title={translate('page.diver-team-area.title.create')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('page.diver-team-area.heading1.create')}
          links={[
            { name: translate('page.diver-team-area.heading2'), href: PATH_DASHBOARD.root },
            {
              name: translate('page.diver-team-area.heading3'),
              href: PATH_DASHBOARD.diver.area
            },
            { name: translate('page.diver-team-area.heading4.new') }
          ]}
        />
        <DiverTeamAreaNewForm />
      </Container>
    </Page>
  );
}
