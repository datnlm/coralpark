import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import { manageCoral } from '_apis_/coral';
import LoadingScreen from 'components/LoadingScreen';
import { Phases } from '../../@types/coral';
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
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [currentPhase, setCurrentPhases] = useState<Phases>();

  const fetchData = async () => {
    setIsLoading(true);
    await manageCoral.getCoralPhaseByID(paramCase(name)).then((response) => {
      if (response.status == 200) {
        const data = {
          id: response.data.id,
          name: response.data.name,
          imageUrl: response.data.imageUrl,
          description: response.data.description
        };
        setCurrentPhases(data);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    if (isEdit) {
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
            <CoralPhasesNewForm isEdit={isEdit} currentPhases={currentPhase} />
          </Container>
        </Page>
      )}
    </>
  );
}
