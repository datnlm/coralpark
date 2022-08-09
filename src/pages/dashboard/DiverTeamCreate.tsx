import { useEffect, useState } from 'react';
// material
import { paramCase } from 'change-case';
import { Container } from '@material-ui/core';
import { useParams, useLocation } from 'react-router-dom';
import DiverTeaTransferList from 'components/_dashboard/diver/DiverTeamTransferList';
import { manageDiver } from '_apis_/diver';
import LoadingScreen from 'components/LoadingScreen';
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
import { DiverTeam } from '../../@types/diver';
// ----------------------------------------------------------------------

export default function DiverTeamCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  const dispatch = useDispatch();
  const [currentDiverTeam, setCurrentDiverTeam] = useState<DiverTeam>();
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    await manageDiver.getDiverTeamByID(paramCase(name)).then((response) => {
      if (response.status === 200) {
        const data = {
          id: response.data.id,
          name: response.data.name,
          number: response.data.number,
          divers: response.data.divers,
          areas: response.data.areas,
          status: response.data.status
        };
        setCurrentDiverTeam(data);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    if (isEdit) {
      fetchData();
    }
    dispatch(getListDiverTeam(0, -1));
    dispatch(getListArea(0, -1));
  }, []);
  return (
    <>
      {isLoading == true ? (
        <LoadingScreen />
      ) : (
        <Page title={translate('page.diver-team.title.create')}>
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading={translate('page.diver-team.heading1.create')}
              links={[
                { name: translate('page.diver-team.heading2'), href: PATH_DASHBOARD.root },
                {
                  name: translate('page.diver-team.heading3'),
                  href: PATH_DASHBOARD.staff.team
                },
                { name: translate('page.diver-team.heading4.new') }
              ]}
            />
            <DiverTeaTransferList isEdit={isEdit} currentDiverTeam={currentDiverTeam} />
          </Container>
        </Page>
      )}
    </>
  );
}
