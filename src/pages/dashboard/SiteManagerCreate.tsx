import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import { manageEmployee } from '_apis_/employee';
import { Employee } from '../../@types/employee';
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
  const [currentEmployee, setCurrentEmployee] = useState<Employee>();

  const fetchData = async () => {
    await manageEmployee.getEmployeeByID(name).then((response) => {
      if (response.status == 200) {
        const data = {
          id: response.data.id,
          name: response.data.name,
          phone: response.data.phone,
          email: response.data.email,
          address: response.data.address,
          password: response.data.password,
          imageUrl: response.data.imageUrl,
          status: response.data.status
        };
        setCurrentEmployee(data);
      }
    });
  };

  useEffect(() => {
    if (isEdit) {
      fetchData();
    }
  }, [dispatch]);

  return (
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
            { name: translate('page.site-manager.heading3'), href: PATH_DASHBOARD.staff.root },
            { name: !isEdit ? translate('page.site-manager.heading4.new') : name }
          ]}
        />
        <SiteManagerNewForm isEdit={isEdit} currentEmployee={currentEmployee} />
      </Container>
    </Page>
  );
}
