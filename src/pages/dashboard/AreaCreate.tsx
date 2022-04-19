import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { manageArea } from '_apis_/area';
// material
import { Container } from '@material-ui/core';
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
import ProductNewForm from '../../components/_dashboard/area/ProductNewForm';

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
  const currentArea = arealist.find((area) => paramCase(area.id.toString()) === name);
  // const [currentArea, setCurrentArea] = useState({
  //   id: 'string',
  //   location: 'string',
  //   address: 'string',
  //   provinceName: 'string',
  //   provinceID: 'string'
  // });

  const fetchData = async () => {
    // await manageArea.getAreaByID(paramCase(name)).then((response) => {
    //   setCurrentArea(response.data);
    // });
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  return (
    <Page title="Area: Create a new area">
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
        <ProductNewForm isEdit={isEdit} currentArea={currentArea} />
        {/* currentArea={currentArea} */}
      </Container>
    </Page>
  );
}
