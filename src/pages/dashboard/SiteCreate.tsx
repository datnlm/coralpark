import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import { manageGarden } from '_apis_/garden';
import LoadingScreen from 'components/LoadingScreen';
// redux
import { useDispatch } from '../../redux/store';
import { getListGarden } from '../../redux/slices/garden';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useLocales from '../../hooks/useLocales';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import SiteNewForm from '../../components/_dashboard/garden/SiteNewForm';
import { Site } from '../../@types/garden';
// ----------------------------------------------------------------------

export default function GardenCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  const [currentSite, setCurrentSite] = useState<Site>();
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    await manageGarden.getSiteByID(paramCase(name)).then((response) => {
      if (response.status == 200) {
        const data = {
          id: response.data.id,
          name: response.data.name,
          imageUrl: response.data.imageUrl,
          createTime: response.data.createTime,
          phone: response.data.phone,
          email: response.data.email,
          address: response.data.address,
          webUrl: response.data.webUrl,
          latitude: response.data.latitude,
          longitude: response.data.longitude,
          status: response.data.status,
          listGarden: response.data.listGarden
        };
        setCurrentSite(data);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    if (isEdit) {
      dispatch(getListGarden(0, -1));
      fetchData();
    }
  }, [dispatch]);

  return (
    <>
      {isLoading == true ? (
        <LoadingScreen />
      ) : (
        <Page
          title={
            !isEdit ? translate('page.site.title.create') : translate('page.site.title.update')
          }
        >
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading={
                !isEdit
                  ? translate('page.site.heading1.create')
                  : translate('page.site.heading1.update')
              }
              links={[
                { name: translate('page.site.heading2'), href: PATH_DASHBOARD.root },
                { name: translate('page.site.heading3'), href: PATH_DASHBOARD.site.root },
                { name: !isEdit ? translate('page.site.heading4.new') : name }
              ]}
            />
            <SiteNewForm isEdit={isEdit} currentSite={currentSite} />
          </Container>
        </Page>
      )}
    </>
  );
}
