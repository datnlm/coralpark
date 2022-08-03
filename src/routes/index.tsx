import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component: any) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          )
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify', element: <VerifyCode /> }
      ]
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <GeneralApp /> },
        {
          path: 'area',
          children: [
            { path: '/', element: <Navigate to="/dashboard/area/list" replace /> },
            { path: 'list', element: <AreaList /> },
            { path: 'new', element: <AreaCreate /> },
            { path: '/:name/edit', element: <AreaCreate /> }
          ]
        },
        {
          path: 'account',
          children: [
            { path: '/', element: <Navigate to="/dashboard/account/list" replace /> },
            { path: 'list', element: <AccountList /> }
          ]
        },
        {
          path: 'staff',
          children: [
            { path: '/', element: <Navigate to="/dashboard/staff" replace /> },
            { path: '/site-manager/list', element: <SiteManagerList /> },
            { path: '/employee/list', element: <EmployeeList /> },
            { path: '/site-manager/new', element: <SiteManagerCreate /> },
            { path: '/site-manager/:name/edit', element: <SiteManagerCreate /> },
            { path: '/employee/new', element: <EmployeeCreate /> },
            { path: '/employee/:name/edit', element: <EmployeeCreate /> },
            { path: '/employee-partner/list', element: <EmployeePartnerList /> },
            { path: '/employee-partner/new', element: <EmployeePartnerCreate /> },
            { path: '/employee-partner/:name/edit', element: <EmployeePartnerCreate /> },
            { path: '/diver/list', element: <DiverList /> },
            { path: '/diver/new', element: <DiverCreate /> },
            { path: '/diver/:name/edit', element: <DiverCreate /> },
            { path: '/diver/team', element: <DiverTeamList /> },
            { path: '/diver/team/new', element: <DiverTeamCreate /> },
            { path: '/diver/team/:name/edit', element: <DiverTeamCreate /> },
            { path: '/technician/list', element: <TechinicianList /> },
            { path: '/technician/new', element: <TechinicianCreate /> },
            { path: '/technician/:name/edit', element: <TechinicianCreate /> },
            { path: '/technician/area', element: <TechnicianAreaCreate /> }
          ]
        },
        {
          path: 'coral',
          children: [
            { path: '/', element: <Navigate to="/dashboard/coral/list" replace /> },
            { path: 'list', element: <CoralList /> },
            { path: 'new', element: <CoralCreate /> },
            { path: '/:name/edit', element: <CoralCreate /> },
            { path: 'type', element: <CoralType /> },
            { path: 'type/:name/edit', element: <CoralType /> },
            { path: 'coral-type-list', element: <CoralTypeList /> },
            { path: 'health', element: <CoralHealthList /> },
            { path: 'health/new', element: <CoralHealthCreate /> },
            { path: 'health/:name/edit', element: <CoralHealthCreate /> },
            { path: '/phases/list', element: <PhaseList /> },
            { path: '/phases/new', element: <PhasesCreate /> },
            { path: '/phases/:name/edit', element: <PhasesCreate /> },
            { path: '/phases/type/new', element: <PhasesTypeCreate /> }
          ]
        },
        {
          path: 'coralArea',
          children: [
            { path: '/', element: <Navigate to="/dashboard/coralarea/list" replace /> },
            { path: 'list', element: <CoraAreaList /> }
            // { path: 'new', element: <CoralAreaCreate /> }
          ]
        },
        {
          path: 'site',
          children: [
            { path: '/', element: <Navigate to="/dashboard/site/list" replace /> },
            { path: 'list', element: <SiteList /> },
            { path: 'new', element: <SiteCreate /> },
            { path: '/:name/edit', element: <SiteCreate /> },
            { path: '/garden/list', element: <GardenList /> },
            { path: '/garden/types', element: <GardenTypesList /> },
            { path: '/garden/new', element: <GardenCreate /> },
            { path: '/garden/type-new', element: <GardenTypeCreate /> },
            { path: '/garden/types/:name/edit', element: <GardenTypeCreate /> },
            { path: '/garden/:name/edit', element: <GardenCreate /> },
            { path: '/cell/types', element: <CellTypeList /> },
            { path: '/cell/type-new', element: <CellTypeCreate /> },
            { path: '/cell/types/:name/edit', element: <CellTypeCreate /> }
          ]
        },
        {
          path: 'group-mode',
          children: [
            { path: '/', element: <Navigate to="/dashboard/group-mode/list" replace /> },
            { path: 'list', element: <GroupModeList /> },
            { path: 'new', element: <GroupModeCreate /> },
            { path: ':name/edit', element: <GroupModeCreate /> }
          ]
        },
        {
          path: 'group-role',
          children: [
            { path: '/', element: <Navigate to="/dashboard/group-role/list" replace /> },
            { path: 'list', element: <GroupRoleList /> },
            { path: 'new', element: <GroupRoleCreate /> },
            { path: ':name/edit', element: <GroupRoleCreate /> }
          ]
        },
        {
          path: 'categories',
          children: [
            { path: '/', element: <Navigate to="/dashboard/categories/list" replace /> },
            { path: 'list', element: <CategoriesList /> },
            { path: 'new', element: <CategoriesCreate /> },
            { path: '/:name/edit', element: <CategoriesCreate /> }
          ]
        },
        {
          path: 'partner',
          children: [
            { path: '/', element: <Navigate to="/dashboard/partner/list" replace /> },
            { path: 'list', element: <PartnerList /> },
            { path: 'new', element: <PartnerCreate /> },
            { path: '/:name/edit', element: <PartnerCreate /> },
            { path: 'types', element: <PartnerTypeList /> },
            { path: 'type-new', element: <PartnerTypeCreate /> },
            { path: 'type/:name/edit', element: <PartnerTypeCreate /> }
          ]
        }
      ]
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'maintenance', element: <Maintenance /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: '/',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <GeneralApp /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Register = Loadable(lazy(() => import('../pages/authentication/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/authentication/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/authentication/VerifyCode')));
// Dashboard
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const AreaList = Loadable(lazy(() => import('../pages/dashboard/AreaList')));
const AccountList = Loadable(lazy(() => import('../pages/dashboard/AccountList')));
const EmployeeList = Loadable(lazy(() => import('../pages/dashboard/EmployeeList')));
const EmployeeCreate = Loadable(lazy(() => import('../pages/dashboard/EmployeeCreate')));
const EmployeePartnerList = Loadable(lazy(() => import('../pages/dashboard/EmployeePartnerList')));
const EmployeePartnerCreate = Loadable(
  lazy(() => import('../pages/dashboard/EmployeePartnerCreate'))
);
const SiteManagerList = Loadable(lazy(() => import('../pages/dashboard/SiteManagerList')));
const SiteManagerCreate = Loadable(lazy(() => import('../pages/dashboard/SiteManagerCreate')));
const AreaCreate = Loadable(lazy(() => import('../pages/dashboard/AreaCreate')));
const PhaseList = Loadable(lazy(() => import('../pages/dashboard/CoralPhaseList')));
const PhasesCreate = Loadable(lazy(() => import('../pages/dashboard/CoralPhases')));
const PhasesTypeCreate = Loadable(lazy(() => import('../pages/dashboard/CoralPhasesType')));
const CoraAreaList = Loadable(lazy(() => import('../pages/dashboard/CoralAreaList')));
const CoralList = Loadable(lazy(() => import('../pages/dashboard/CoralList')));
const CoralCreate = Loadable(lazy(() => import('../pages/dashboard/CoralCreate')));
const CoralType = Loadable(lazy(() => import('../pages/dashboard/CoralType')));
const CoralTypeList = Loadable(lazy(() => import('../pages/dashboard/CoralTypeList')));
const CoralHealthCreate = Loadable(lazy(() => import('../pages/dashboard/CoralHealthCreate')));
const CoralHealthList = Loadable(lazy(() => import('../pages/dashboard/CoralHealthList')));
const GardenList = Loadable(lazy(() => import('../pages/dashboard/GardenList')));
const GroupModeList = Loadable(lazy(() => import('../pages/dashboard/GroupModeList')));
const GroupModeCreate = Loadable(lazy(() => import('../pages/dashboard/GroupModeCreate')));
const GroupRoleList = Loadable(lazy(() => import('../pages/dashboard/GroupRoleList')));
const GroupRoleCreate = Loadable(lazy(() => import('../pages/dashboard/GroupRoleCreate')));
const CategoriesList = Loadable(lazy(() => import('../pages/dashboard/CategoriesList')));
const CategoriesCreate = Loadable(lazy(() => import('../pages/dashboard/CategoriesCreate')));
const SiteList = Loadable(lazy(() => import('../pages/dashboard/SiteList')));
const GardenTypesList = Loadable(lazy(() => import('../pages/dashboard/GardenTypesList')));
const GardenTypeCreate = Loadable(lazy(() => import('../pages/dashboard/GardenTypeCreate')));
const CellTypeList = Loadable(lazy(() => import('../pages/dashboard/CellTypeList')));
const CellTypeCreate = Loadable(lazy(() => import('../pages/dashboard/CellTypeCreate')));
const PartnerTypeList = Loadable(lazy(() => import('../pages/dashboard/PartnerTypeList')));
const PartnerList = Loadable(lazy(() => import('../pages/dashboard/PartnerList')));
const PartnerTypeCreate = Loadable(lazy(() => import('../pages/dashboard/PartnerTypeCreate')));
const PartnerCreate = Loadable(lazy(() => import('../pages/dashboard/PartnerCreate')));
const GardenCreate = Loadable(lazy(() => import('../pages/dashboard/GardenCreate')));
const SiteCreate = Loadable(lazy(() => import('../pages/dashboard/SiteCreate')));
const DiverList = Loadable(lazy(() => import('../pages/dashboard/DiverList')));
const DiverCreate = Loadable(lazy(() => import('../pages/dashboard/DiverCreate')));
const DiverTeamCreate = Loadable(lazy(() => import('../pages/dashboard/DiverTeamCreate')));
const DiverTeamList = Loadable(lazy(() => import('../pages/dashboard/DiverTeamList')));
const TechinicianList = Loadable(lazy(() => import('../pages/dashboard/TechnicianList')));
const TechinicianCreate = Loadable(lazy(() => import('../pages/dashboard/TechnicianCreate')));
const TechnicianAreaCreate = Loadable(
  lazy(() => import('../pages/dashboard/TechnicianAreaCreate'))
);
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
