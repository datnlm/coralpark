// material
import { Container, Grid } from '@material-ui/core';
import {
  AnalyticsCorals,
  AnalyticsDivers,
  AnalyticsGardens,
  AnalyticsPartners
} from 'components/_dashboard/general-analytics';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import {
  AppWelcome,
  AppWidgets1,
  AppWidgets2,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppTotalDownloads,
  AppTotalInstalled,
  AppCurrentDownload,
  AppTotalActiveUsers,
  AppTopInstalledCountries
} from '../../components/_dashboard/general-app';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();

  return (
    <Page title="Dashboard: App | CPMS">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          {/* <Grid item xs={12} md={8}>
            <AppWelcome displayName={user?.displayName} />
          </Grid> */}

          {/* <Grid item xs={12} md={4}>
            <AppFeatured />
          </Grid> */}

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsPartners />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsGardens />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsDivers />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsCorals />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppAreaInstalled />
          </Grid>

          <Grid item xs={12} lg={8}>
            <AppNewInvoice />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopRelated />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopInstalledCountries />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopAuthors />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <AppWidgets1 />
              </Grid>
              <Grid item xs={12}>
                <AppWidgets2 />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
