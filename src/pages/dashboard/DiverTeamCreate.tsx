import { useEffect } from 'react';
// material
import { Container } from '@material-ui/core';
import DiverTeaTransferList from 'components/_dashboard/diver/DiverTeamTransferList';
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

export default function DiverTeamCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getListDiverTeam(0, -1));
    dispatch(getListArea(0, -1));
  }, []);
  return (
    <Page title={translate('page.diver-team.title.create')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('page.diver-team.heading1.create')}
          links={[
            { name: translate('page.diver-team.heading2'), href: PATH_DASHBOARD.root },
            {
              name: translate('page.diver-team.heading3'),
              href: PATH_DASHBOARD.diver.team
            },
            { name: translate('page.diver-team.heading4.new') }
          ]}
        />
        <DiverTeaTransferList />
      </Container>
    </Page>
  );
}
