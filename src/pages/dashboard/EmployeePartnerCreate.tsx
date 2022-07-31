import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import { manageEmployee } from '_apis_/employee';
import { getListPartner } from 'redux/slices/partner';
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
import EmployeePartnerNewForm from '../../components/_dashboard/account/EmployeePartnerNewForm';
import { EmployeePartner } from '../../@types/staff';

// ----------------------------------------------------------------------

export default function EmployeeCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  const [currentEmployeePartner, setCurrentEmployeePartner] = useState<EmployeePartner>();

  const fetchData = async () => {
    await manageEmployee.getEmployeePartnerByID(name).then((response) => {
      if (response.status == 200) {
        const data = {
          id: response.data.id,
          name: response.data.name,
          phone: response.data.phone,
          email: response.data.email,
          address: response.data.address,
          password: response.data.password,
          imageUrl: response.data.imageUrl,
          partnerId: response.data.partnerId,
          status: response.data.status
        };
        setCurrentEmployeePartner(data);
      }
    });
  };

  useEffect(() => {
    if (isEdit) {
      fetchData();
      dispatch(getListPartner(0, -1));
    }
  }, [dispatch]);

  return (
    <Page
      title={
        !isEdit
          ? translate('page.employee-partner.title.create')
          : translate('page.employee-partner.title.update')
      }
    >
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={
            !isEdit
              ? translate('page.employee-partner.heading1.create')
              : translate('page.employee-partner.heading1.update')
          }
          links={[
            { name: translate('page.employee-partner.heading2'), href: PATH_DASHBOARD.root },
            {
              name: translate('page.employee-partner.heading3'),
              href: PATH_DASHBOARD.staff.listEmployeePartner
            },
            { name: !isEdit ? translate('page.employee-partner.heading4.new') : name }
          ]}
        />
        <EmployeePartnerNewForm isEdit={isEdit} currentEmployeePartner={currentEmployeePartner} />
      </Container>
    </Page>
  );
}
