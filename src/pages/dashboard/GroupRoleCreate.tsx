import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { manageGroup } from '_apis_/group';
// material
import { Container } from '@material-ui/core';
import { getListGroupMode } from 'redux/slices/groupMode';
import LoadingScreen from 'components/LoadingScreen';
import { GroupMode, GroupRole } from '../../@types/group';
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
import GroupRoleNewForm from '../../components/_dashboard/group/GroupRoleNewForm';

// ----------------------------------------------------------------------

export default function GroupRoleCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const isEdit = pathname.includes('edit');
  const [currentGroupRole, setCurrentGroupRole] = useState<GroupRole>();
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    await manageGroup.getGroupRoleByID(paramCase(name)).then((response) => {
      setCurrentGroupRole(response.data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (isEdit) {
      fetchData();
      dispatch(getListGroupMode(0, -1));
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
              ? translate('page.group-role.title.create')
              : translate('page.group-role.title.update')
          }
        >
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading={
                !isEdit
                  ? translate('page.group-role.heading1.create')
                  : translate('page.group-role.heading1.update')
              }
              links={[
                { name: translate('page.group-role.heading2'), href: PATH_DASHBOARD.root },
                {
                  name: translate('page.group-role.heading3'),
                  href: PATH_DASHBOARD.group.listRole
                },
                { name: !isEdit ? translate('page.group-role.heading4.new') : name }
              ]}
            />
            <GroupRoleNewForm isEdit={isEdit} currentGroupRole={currentGroupRole} />
          </Container>
        </Page>
      )}
    </>
  );
}
