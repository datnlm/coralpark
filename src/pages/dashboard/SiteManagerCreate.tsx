import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import { manageEmployee } from '_apis_/employee';
import { getListSites } from 'redux/slices/garden';
import LoadingScreen from 'components/LoadingScreen';
import { SiteManager } from '../../@types/staff';
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
import SiteManagerNewForm from '../../components/_dashboard/account/SiteManagerNewForm';

// ----------------------------------------------------------------------

export default function EmployeeCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  const [currentEmployee, setCurrentEmployee] = useState<SiteManager>();
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    await manageEmployee.getEmployeeByID(name).then((response) => {
      if (response.status == 200) {
        const data = {
          id: response.data.id,
          name: response.data.name,
          phone: response.data.phone,
          email: response.data.email,
          address: response.data.address,
          password: response.data.password,
          siteId: response.data.siteId,
          imageUrl: response.data.imageUrl,
          status: response.data.status
        };
        setCurrentEmployee(data);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    if (isEdit) {
      fetchData();
      dispatch(getListSites(0, -1));
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
              ? translate('page.site-manager.title.create')
              : translate('page.site-manager.title.update')
          }
        >
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading={
                !isEdit
                  ? translate('page.site-manager.heading1.create')
                  : translate('page.site-manager.heading1.update')
              }
              links={[
                { name: translate('page.site-manager.heading2'), href: PATH_DASHBOARD.root },
                {
                  name: translate('page.site-manager.heading3'),
                  href: PATH_DASHBOARD.staff.listSite
                },
                { name: !isEdit ? translate('page.site-manager.heading4.new') : name }
              ]}
            />
            <SiteManagerNewForm isEdit={isEdit} currentEmployee={currentEmployee} />
          </Container>
        </Page>
      )}
    </>
  );
}
