import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import { manageCoral } from '_apis_/coral';
import { CoralType } from '../../@types/user';
// redux
import { useDispatch, useSelector, RootState } from '../../redux/store';
import { getUserList } from '../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import CoralTypeNewForm from '../../components/_dashboard/coral/CoralTypeNewForm';

// ----------------------------------------------------------------------

export default function UserCreate() {
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
  }, []);

  return (
    <Page title={!isEdit ? 'Coral Type: Create a new coral type' : 'Coral Type: Edit coral type'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new coral type' : 'Edit coral type'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Coral Type', href: PATH_DASHBOARD.coral.listType },
            { name: !isEdit ? 'New coral type' : name }
          ]}
        />
        <CoralTypeNewForm isEdit={isEdit} currentType={currentType} />
        {/* <CoralTypeNewForm isEdit={isEdit} currentUser={currentUser} /> */}
      </Container>
    </Page>
  );
}
