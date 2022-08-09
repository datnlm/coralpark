import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Box, Card, CardHeader, Container, Stack } from '@material-ui/core';
import { manageTechnican } from '_apis_/technician';
import { getListArea } from 'redux/slices/area';
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
import TechnicianNewForm from '../../components/_dashboard/technician/TechnicianNewForm';
import { Technician } from '../../@types/technicians';

// ----------------------------------------------------------------------

export default function TechinicianCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  const [currentTechnician, setCurrentTechnician] = useState<Technician>();
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    await manageTechnican.getTechnicanByID(paramCase(name)).then((response) => {
      if (response.status == 200) {
        const data = {
          id: response.data.id,
          name: response.data.name,
          phone: response.data.phone,
          email: response.data.email,
          address: response.data.address,
          imageUrl: response.data.imageUrl,
          status: response.data.status,
          areas: response.data.areas
        };
        setCurrentTechnician(data);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    dispatch(getListArea(0, -1));
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
              ? translate('page.technician.title.create')
              : translate('page.technician.title.update')
          }
        >
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading={
                !isEdit
                  ? translate('page.technician.heading1.create')
                  : translate('page.technician.heading1.update')
              }
              links={[
                { name: translate('page.technician.heading2'), href: PATH_DASHBOARD.root },
                {
                  name: translate('page.technician.heading3'),
                  href: PATH_DASHBOARD.staff.listTechnician
                },
                { name: !isEdit ? translate('page.technician.heading4.new') : name }
              ]}
            />
            <TechnicianNewForm isEdit={isEdit} currentTechnician={currentTechnician} />
          </Container>
        </Page>
      )}
    </>
  );
}
