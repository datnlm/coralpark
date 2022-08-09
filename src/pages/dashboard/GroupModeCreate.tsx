import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { manageGroup } from '_apis_/group';
// material
import { Container } from '@material-ui/core';
import LoadingScreen from 'components/LoadingScreen';
import { GroupMode } from '../../@types/group';
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
import GroupModeNewForm from '../../components/_dashboard/group/GroupModeNewForm';

// ----------------------------------------------------------------------

export default function GroupModeCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const isEdit = pathname.includes('edit');
  const [currentGroupMode, setCurrentGroupMode] = useState<GroupMode>();
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    await manageGroup.getGroupModeByID(paramCase(name)).then((response) => {
      setCurrentGroupMode(response.data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
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
              ? translate('page.group-mode.title.create')
              : translate('page.group-mode.title.update')
          }
        >
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading={
                !isEdit
                  ? translate('page.group-mode.heading1.create')
                  : translate('page.group-mode.heading1.update')
              }
              links={[
                { name: translate('page.group-mode.heading2'), href: PATH_DASHBOARD.root },
                {
                  name: translate('page.group-mode.heading3'),
                  href: PATH_DASHBOARD.group.root
                },
                { name: !isEdit ? translate('page.group-mode.heading4.new') : name }
              ]}
            />
            <GroupModeNewForm isEdit={isEdit} currentGroupMode={currentGroupMode} />
          </Container>
        </Page>
      )}
    </>
  );
}
