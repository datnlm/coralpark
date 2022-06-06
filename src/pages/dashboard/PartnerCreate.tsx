import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import { managePartner } from '_apis_/partner';
import PartnerNewForm from 'components/_dashboard/partner/PartnerNewForm';
import { Partner } from '../../@types/partner';
// redux
import { useDispatch, useSelector, RootState } from '../../redux/store';
import { getListPartnerType } from '../../redux/slices/partner';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useLocales from '../../hooks/useLocales';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// ----------------------------------------------------------------------

export default function ParterTypeCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);

  const fetchData = async () => {
    await managePartner.getPartnerByID(paramCase(name)).then((response) => {
      if (response.status == 200) {
        const data = {
          id: response.data.id,
          name: response.data.name,
          phone: response.data.phone,
          email: response.data.email,
          address: response.data.address,
          webUrl: response.data.webUrl,
          partnerTypeId: response.data.partnerTypeId,
          status: response.data.status
        };
        setCurrentPartner(data);
      }
    });
  };

  useEffect(() => {
    dispatch(getListPartnerType(0, -1));
    if (isEdit) {
      fetchData();
    }
  }, [dispatch]);

  return (
    <Page
      title={
        !isEdit ? translate('page.partner.title.create') : translate('page.partner.title.update')
      }
    >
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={
            !isEdit
              ? translate('page.partner.heading1.create')
              : translate('page.partner.heading1.update')
          }
          links={[
            { name: translate('page.partner.heading2'), href: PATH_DASHBOARD.root },
            { name: translate('page.partner.heading3'), href: PATH_DASHBOARD.partner.root },
            { name: !isEdit ? translate('page.partner.heading4.new') : name }
          ]}
        />
        <PartnerNewForm isEdit={isEdit} currentPartner={currentPartner} />
      </Container>
    </Page>
  );
}
