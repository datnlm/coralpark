import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { manageGroupMode } from '_apis_/group-mode';
// material
import { Container } from '@material-ui/core';
import { GroupMode } from '../../@types/group-mode';
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
import GroupModeNewForm from '../../components/_dashboard/group-mode/GroupModeNewForm';

// ----------------------------------------------------------------------

export default function GroupModeCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const isEdit = pathname.includes('edit');
  const [currentGroupMode, setCurrentGroupMode] = useState<GroupMode>();

  const fetchData = async () => {
    await manageGroupMode.getGroupModeByID(paramCase(name)).then((response) => {
      setCurrentGroupMode(response.data);
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
  );
}
