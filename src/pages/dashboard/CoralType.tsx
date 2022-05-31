import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import { manageCoral } from '_apis_/coral';
import { CoralType } from '../../@types/coral';
// redux
import { useDispatch } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useLocales from '../../hooks/useLocales';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import CoralTypeNewForm from '../../components/_dashboard/coral/CoralTypeNewForm';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const isEdit = pathname.includes('edit');

  const [currentType, setCurrentType] = useState<CoralType | null>(null);

  useEffect(() => {
    if (isEdit) {
      manageCoral.getCoralTypeByID(paramCase(name)).then((response) => {
        if (response.status == 200) {
          const data = {
            id: response.data.id,
            name: response.data.name,
            parentId: response.data.parentId,
            levelType: response.data.levelType,
            description: response.data.description,
            parents: response.data.parents
          };
          setCurrentType(data);
        }
      });
    }
  }, [dispatch]);

  return (
    <Page
      title={
        !isEdit ? translate('page.coral-type.title.create') : translate('page.site.title.update')
      }
    >
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={
            !isEdit
              ? translate('page.coral-type.heading1.create')
              : translate('page.coral-type.heading1.update')
          }
          links={[
            { name: translate('page.coral-type.heading2'), href: PATH_DASHBOARD.root },
            { name: translate('page.coral-type.heading3'), href: PATH_DASHBOARD.coral.listType },
            { name: !isEdit ? translate('page.coral-type.heading4.new') : name }
          ]}
        />
        <CoralTypeNewForm isEdit={isEdit} currentType={currentType} />
      </Container>
    </Page>
  );
}
