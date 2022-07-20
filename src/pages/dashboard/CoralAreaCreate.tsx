import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';

import CoralAreaNewForm from 'components/_dashboard/coral_area/CoralAreaTransferList';
import { manageCoral } from '_apis_/coral';

// redux
import { useDispatch } from '../../redux/store';
import { getListArea } from '../../redux/slices/area';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// // hooks
// import useSettings from '../../hooks/useSettings';
// import useLocales from '../../hooks/useLocales';
// // components
// import Page from '../../components/Page';
// import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// // ----------------------------------------------------------------------

// export default function UserCreate() {
//   const { translate } = useLocales();
//   const { themeStretch } = useSettings();
//   const dispatch = useDispatch();
//   const { pathname } = useLocation();
//   const { name } = useParams();
//   // const isEdit = pathname.includes('edit');

//   useEffect(() => {
//     dispatch(getListArea(0, -1));
//   });
//   return (
//     <Page title={translate('page.coral-area.title.create')}>
//       <Container maxWidth={themeStretch ? false : 'lg'}>
//         <HeaderBreadcrumbs
//           heading={translate('page.coral-area.heading1.create')}
//           links={[
//             { name: translate('page.coral-area.heading2'), href: PATH_DASHBOARD.root },
//             { name: translate('page.coral-area.heading3'), href: PATH_DASHBOARD.coralArea.new },
//             { name: translate('page.coral-area.heading4.new') }
//           ]}
//         />
//         <CoralAreaNewForm />
//       </Container>
//     </Page>
//   );
// }
