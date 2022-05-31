import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import { manageGarden } from '_apis_/garden';
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
import GardenNewForm from '../../components/_dashboard/garden/GardenNewForm';
import { Garden } from '../../@types/garden';
// ----------------------------------------------------------------------

export default function GardenCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  const [currentGarden, setCurrentGarden] = useState<Garden>();

  useEffect(() => {
    if (isEdit) {
      manageGarden.getGardenByID(paramCase(name)).then((response) => {
        if (response.status == 200) {
          const data = {
            id: response.data.id,
            name: response.data.name,
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            address: response.data.address,
            acreage: response.data.acreage,
            quantityOfCells: response.data.quantityOfCells,
            areaID: response.data.area,
            gardenTypeId: response.data.gardenType,
            siteId: response.data.site,
            status: response.data.status
          };
          setCurrentGarden(data);
        }
      });
    }
  }, [dispatch]);

  return (
    <Page
      title={
        !isEdit ? translate('page.garden.title.create') : translate('page.garden.title.update')
      }
    >
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={
            !isEdit
              ? translate('page.garden.heading1.create')
              : translate('page.garden.heading1.update')
          }
          links={[
            { name: translate('page.site.heading2'), href: PATH_DASHBOARD.root },
            { name: translate('page.site.heading3'), href: PATH_DASHBOARD.garden.root },
            { name: !isEdit ? translate('page.site.heading4.new') : name }
          ]}
        />

        <GardenNewForm isEdit={isEdit} currentGarden={currentGarden} />
      </Container>
    </Page>
  );
}
