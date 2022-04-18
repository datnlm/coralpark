// import { Icon } from '@iconify/react';
// import { capitalCase } from 'change-case';
// import { useState, useEffect } from 'react';
// import bellFill from '@iconify/icons-eva/bell-fill';
// import shareFill from '@iconify/icons-eva/share-fill';
// import roundVpnKey from '@iconify/icons-ic/round-vpn-key';
// import roundReceipt from '@iconify/icons-ic/round-receipt';
// import roundAccountBox from '@iconify/icons-ic/round-account-box';
// // material
// import { Container, Tab, Box, Tabs } from '@material-ui/core';
// // redux
// import { RootState, useDispatch, useSelector } from '../../redux/store';
// import {
//   getCards,
//   getProfile,
//   getInvoices,
//   getAddressBook,
//   getNotifications
// } from '../../redux/slices/user';
// // routes
// import { PATH_DASHBOARD } from '../../routes/paths';
// // hooks
// import useSettings from '../../hooks/useSettings';
// // components
// import Page from '../../components/Page';
// import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// import {
//   AccountGeneral,
//   AccountBilling,
//   AccountSocialLinks,
//   AccountNotifications,
//   AccountChangePassword
// } from '../../components/_dashboard/user/account';

// // ----------------------------------------------------------------------

// export default function UserAccount() {
//   const { themeStretch } = useSettings();
//   const dispatch = useDispatch();
//   const { cards, invoices, myProfile, addressBook, notifications } = useSelector(
//     (state: RootState) => state.user
//   );

//   const [currentTab, setCurrentTab] = useState('general');

//   useEffect(() => {
//     dispatch(getCards());
//     dispatch(getAddressBook());
//     dispatch(getInvoices());
//     dispatch(getNotifications());
//     dispatch(getProfile());
//   }, [dispatch]);

//   if (!myProfile) {
//     return null;
//   }

//   if (!cards) {
//     return null;
//   }

//   if (!notifications) {
//     return null;
//   }

//   const ACCOUNT_TABS = [
//     {
//       value: 'general',
//       icon: <Icon icon={roundAccountBox} width={20} height={20} />,
//       component: <AccountGeneral />
//     },
//     {
//       value: 'billing',
//       icon: <Icon icon={roundReceipt} width={20} height={20} />,
//       component: <AccountBilling cards={cards} addressBook={addressBook} invoices={invoices} />
//     },
//     {
//       value: 'notifications',
//       icon: <Icon icon={bellFill} width={20} height={20} />,
//       component: <AccountNotifications notifications={notifications} />
//     },
//     {
//       value: 'social_links',
//       icon: <Icon icon={shareFill} width={20} height={20} />,
//       component: <AccountSocialLinks myProfile={myProfile} />
//     },
//     {
//       value: 'change_password',
//       icon: <Icon icon={roundVpnKey} width={20} height={20} />,
//       component: <AccountChangePassword />
//     }
//   ];

//   return (
//     <Page title="User: Account Settings | Minimal-UI">
//       <Container maxWidth={themeStretch ? false : 'lg'}>
//         <HeaderBreadcrumbs
//           heading="Account"
//           links={[
//             { name: 'Dashboard', href: PATH_DASHBOARD.root },
//             { name: 'User', href: PATH_DASHBOARD.user.root },
//             { name: 'Account Settings' }
//           ]}
//         />

//         <Tabs
//           value={currentTab}
//           scrollButtons="auto"
//           variant="scrollable"
//           allowScrollButtonsMobile
//           onChange={(e, value) => setCurrentTab(value)}
//         >
//           {ACCOUNT_TABS.map((tab) => (
//             <Tab
//               disableRipple
//               key={tab.value}
//               label={capitalCase(tab.value)}
//               icon={tab.icon}
//               value={tab.value}
//             />
//           ))}
//         </Tabs>

//         <Box sx={{ mb: 5 }} />

//         {ACCOUNT_TABS.map((tab) => {
//           const isMatched = tab.value === currentTab;
//           return isMatched && <Box key={tab.value}>{tab.component}</Box>;
//         })}
//       </Container>
//     </Page>
//   );
// }
import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
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
  const { userList } = useSelector((state: RootState) => state.user);
  const isEdit = pathname.includes('edit');

  // const currentUser = userList.find((user) => paramCase(user.name) === name);

  useEffect(() => {
    dispatch(getUserList());
  }, [dispatch]);

  return (
    <Page title="Coral: Create a new list | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new coral type' : 'Edit coral type'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Type', href: PATH_DASHBOARD.user.root },
            { name: !isEdit ? 'New coral type' : name }
          ]}
        />
        <CoralTypeNewForm isEdit={isEdit} />
        {/* <CoralTypeNewForm isEdit={isEdit} currentUser={currentUser} /> */}
      </Container>
    </Page>
  );
}
