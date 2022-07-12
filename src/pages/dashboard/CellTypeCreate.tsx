import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
import { manageCell } from '_apis_/cell';
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

  const [currentCellType, setCurrentCellType] = useState<CellType>();

  useEffect(() => {
    if (isEdit) {
      manageCell.getCellTypeById(paramCase(name)).then((response) => {
        if (response.status == 200) {
          const data = {
            id: response.data.id,
            name: response.data.name,
            imageUrl: response.data.imageUrl,
            description: response.data.description
          };
          setCurrentCellType(data);
        }
      });
    }
  }, [dispatch]);

  return (
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
            { name: translate('page.cell-type.heading3'), href: PATH_DASHBOARD.garden.typesList },
            { name: !isEdit ? translate('page.cell-type.heading4.new') : name }
          ]}
        />

        <CellTypeNewForm isEdit={isEdit} currentCellType={currentCellType} />
      </Container>
    </Page>
  );
}
