import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// coral api
import { manageCoral } from '_apis_/coral';
// material
import { Container } from '@material-ui/core';
import { manageGarden } from '_apis_/garden';
import LoadingScreen from 'components/LoadingScreen';
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
import GardenTypeNewForm from '../../components/_dashboard/garden/GardenTypeNewForm';
import { UserManager, Coral } from '../../@types/coral';
import { GardenType } from '../../@types/garden';
// ----------------------------------------------------------------------

export default function GardenCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [currentGardenType, setCurrentGardenType] = useState<GardenType>();

  const fetechData = async () => {
    setIsLoading(true);
    await manageGarden.getGardenTypeByID(paramCase(name)).then((response) => {
      if (response.status == 200) {
        const data = {
          id: response.data.id,
          name: response.data.name,
          description: response.data.description
        };
        setCurrentGardenType(data);
        setIsLoading(false);
      }
    });
  };
  useEffect(() => {
    if (isEdit) {
      fetechData();
    }
  }, [dispatch]);

  return (
    <>
      {isLoading == true ? (
        <LoadingScreen />
      ) : (
        <Page
          title={
            !isEdit
              ? translate('page.garden-type.title.create')
              : translate('page.garden-type.title.update')
          }
        >
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading={
                !isEdit
                  ? translate('page.garden-type.heading1.create')
                  : translate('page.garden-type.heading1.update')
              }
              links={[
                { name: translate('page.garden-type.heading2'), href: PATH_DASHBOARD.root },
                {
                  name: translate('page.garden-type.heading3'),
                  href: PATH_DASHBOARD.site.typesList
                },
                { name: !isEdit ? translate('page.garden-type.heading4.new') : name }
              ]}
            />

            <GardenTypeNewForm isEdit={isEdit} currentGardenType={currentGardenType} />
          </Container>
        </Page>
      )}
    </>
  );
}
