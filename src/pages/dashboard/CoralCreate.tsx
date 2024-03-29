import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// coral api
import { manageCoral } from '_apis_/coral';
// material
import { Container } from '@material-ui/core';
import { getListArea } from 'redux/slices/area';
import LoadingScreen from 'components/LoadingScreen';
// redux
import { useDispatch } from '../../redux/store';
import { getCoralType, getListCoralPhase } from '../../redux/slices/coral';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useLocales from '../../hooks/useLocales';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import CoralNewForm from '../../components/_dashboard/coral/CoralNewForm';
import { Coral, Habitat } from '../../@types/coral';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  const [currentCoral, setCurrentCoral] = useState<Coral>();
  const [currentHabitat, setCurrentHabitat] = useState<Habitat | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const fetchData = async () => {
    if (isEdit) {
      setIsLoading(true);
      await manageCoral.getCoralByID(paramCase(name)).then((response) => {
        setCurrentCoral(response.data);
        setIsLoading(false);
      });
    }
  };

  useEffect(() => {
    dispatch(getListArea(0, -1));
    dispatch(getListCoralPhase(0, -1));
    dispatch(getCoralType('species', 0, -1));

    fetchData();
  }, [dispatch]);

  return (
    <>
      {isLoading == true ? (
        <LoadingScreen />
      ) : (
        <Page
          title={
            !isEdit ? translate('page.coral.title.create') : translate('page.site.title.update')
          }
        >
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading={
                !isEdit
                  ? translate('page.coral.heading1.create')
                  : translate('page.coral.heading1.update')
              }
              links={[
                { name: translate('page.coral.heading2'), href: PATH_DASHBOARD.root },
                { name: translate('page.coral.heading3'), href: PATH_DASHBOARD.coral.root },
                { name: !isEdit ? translate('page.coral.heading4.new') : name }
              ]}
            />

            <CoralNewForm isEdit={isEdit} currentCoral={currentCoral} />
          </Container>
        </Page>
      )}
    </>
  );
}
