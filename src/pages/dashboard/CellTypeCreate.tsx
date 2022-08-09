import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import { manageCell } from '_apis_/cell';
import LoadingScreen from 'components/LoadingScreen';
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
import CellTypeNewForm from '../../components/_dashboard/cell/CellTypeNewForm';

import { CellType } from '../../@types/cell-type';
// ----------------------------------------------------------------------

export default function GardenCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('edit');
  const { name } = useParams();
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [currentCellType, setCurrentCellType] = useState<CellType>();

  const fetchData = async () => {
    setIsLoading(true);
    if (isEdit) {
      await manageCell.getCellTypeById(paramCase(name)).then((response) => {
        if (response.status == 200) {
          const data = {
            id: response.data.id,
            name: response.data.name,
            imageUrl: response.data.imageUrl,
            description: response.data.description
          };
          setCurrentCellType(data);
          setIsLoading(false);
        }
      });
    }
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
              ? translate('page.cell-type.title.create')
              : translate('page.cell-type.title.update')
          }
        >
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading={
                !isEdit
                  ? translate('page.cell-type.heading1.create')
                  : translate('page.cell-type.heading1.update')
              }
              links={[
                { name: translate('page.cell-type.heading2'), href: PATH_DASHBOARD.root },
                {
                  name: translate('page.cell-type.heading3'),
                  href: PATH_DASHBOARD.site.cellTypesList
                },
                { name: !isEdit ? translate('page.cell-type.heading4.new') : name }
              ]}
            />

            <CellTypeNewForm isEdit={isEdit} currentCellType={currentCellType} />
          </Container>
        </Page>
      )}
    </>
  );
}
