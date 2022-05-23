import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { manageArea } from '_apis_/area';
// material
import { Container } from '@material-ui/core';
import { Area } from '../../@types/area';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts, getAreas } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// @types
import { ProductState } from '../../@types/products';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import AreaNewForm from '../../components/_dashboard/area/AreaNewForm';

// ----------------------------------------------------------------------

export default function AreaCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  // const { products } = useSelector((state: { product: ProductState }) => state.product);
  const arealist = useSelector((state: { product: ProductState }) => state.product.areas);
  const isEdit = pathname.includes('edit');
  // const currentProduct = products.find((product) => paramCase(product.name) === name);
  const [currentArea, setCurrentArea] = useState<Area>();

  const fetchData = async () => {
    // await manageArea.getAreaByID(paramCase(name)).then((response) => {
    //   setCurrentArea(response.data);
    // });
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  return (
    <Page title={!isEdit ? 'Area: Create a new area' : 'Area: Edit area'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new area' : 'Edit area'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Area',
              href: PATH_DASHBOARD.area.root
            },
            { name: !isEdit ? 'New area' : name }
          ]}
        />
        <AreaNewForm isEdit={isEdit} currentArea={currentArea} />
        {/* currentArea={currentArea} */}
      </Container>
    </Page>
  );
}
