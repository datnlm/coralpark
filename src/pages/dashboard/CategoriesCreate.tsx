import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { manageCategories } from '_apis_/categories';
// material
import { Container } from '@material-ui/core';
import LoadingScreen from 'components/LoadingScreen';
import { Categories } from '../../@types/categories';
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
import CategoriesNewForm from '../../components/_dashboard/categories/CategoriesNewForm';

// ----------------------------------------------------------------------

export default function GroupModeCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const isEdit = pathname.includes('edit');
  const [currentCategories, setCurrentCategories] = useState<Categories>();
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    await manageCategories.getCategoriesByID(paramCase(name)).then((response) => {
      setCurrentCategories(response.data);
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
              ? translate('page.categories.title.create')
              : translate('page.categories.title.update')
          }
        >
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading={
                !isEdit
                  ? translate('page.categories.heading1.create')
                  : translate('page.categories.heading1.update')
              }
              links={[
                { name: translate('page.categories.heading2'), href: PATH_DASHBOARD.root },
                {
                  name: translate('page.categories.heading3'),
                  href: PATH_DASHBOARD.group.root
                },
                { name: !isEdit ? translate('page.categories.heading4.new') : name }
              ]}
            />
            <CategoriesNewForm isEdit={isEdit} currentCategories={currentCategories} />
          </Container>
        </Page>
      )}
    </>
  );
}
