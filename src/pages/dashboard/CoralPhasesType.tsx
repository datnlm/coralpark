import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container, Paper, Stack } from '@material-ui/core';
import LinearAlternativeLabel from 'components/_dashboard/coral/LinearAlternativeLabel';
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
import CoralPhasesTypeNewForm from '../../components/_dashboard/coral/CoralPhasesTypeNewForm';

// ----------------------------------------------------------------------

export default function PhasesTypeCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const isEdit = pathname.includes('edit');

  // useEffect(() => {
  //   dispatch(getUserList());
  // }, [dispatch]);

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
            { name: translate('page.coral-phase.heading3'), href: PATH_DASHBOARD.phases.root },
            { name: !isEdit ? translate('page.coral-phase.heading4.new') : name }
          ]}
        />
        <Stack spacing={5}>
          <Paper
            sx={{
              p: 3,
              width: '100%',
              boxShadow: (theme) => theme.customShadows.z8
            }}
          >
            <LinearAlternativeLabel />
          </Paper>
        </Stack>
      </Container>
    </Page>
  );
}
