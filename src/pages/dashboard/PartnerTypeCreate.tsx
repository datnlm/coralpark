import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// coral api
import { manageCoral } from '_apis_/coral';
// material
import { Container } from '@material-ui/core';
import { managePartner } from '_apis_/partner';
import PartnerTypeNewForm from 'components/_dashboard/partner/PartnerTypeNewForm';
import { PartnerType } from '../../@types/partner';
// redux
import { useDispatch, useSelector, RootState } from '../../redux/store';
import { getUserList } from '../../redux/slices/coral';
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
  const [currentPartnerType, setCurrentPartnerType] = useState<PartnerType | null>(null);

  useEffect(() => {
    if (isEdit) {
      managePartner.getPartnerTypeByID(paramCase(name)).then((response) => {
        if (response.status == 200) {
          const data = {
            id: response.data.id,
            name: response.data.name
          };
          setCurrentPartnerType(data);
        }
      });
    }
  }, [dispatch]);

  return (
    <Page
      title={
        !isEdit
          ? translate('page.partner-type.title.create')
          : translate('page.partner-type.title.update')
      }
    >
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={
            !isEdit
              ? translate('page.partner-type.heading1.create')
              : translate('page.partner-type.heading1.update')
          }
          links={[
            { name: translate('page.partner-type.heading2'), href: PATH_DASHBOARD.root },
            {
              name: translate('page.partner-type.heading3'),
              href: PATH_DASHBOARD.partner.typeList
            },
            { name: !isEdit ? translate('page.partner-type.heading4.new') : name }
          ]}
        />
        <PartnerTypeNewForm isEdit={isEdit} currentPartnerType={currentPartnerType} />
      </Container>
    </Page>
  );
}
