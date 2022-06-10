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
            { path: 'list', element: <AccountList /> },
            { path: 'new', element: <AccountCreate /> },
            { path: '/:name/edit', element: <AccountCreate /> }
          ]
        },
        {
          path: 'staff',
          children: [
            { path: '/', element: <Navigate to="/dashboard/staff/list" replace /> },
            { path: 'list', element: <StaffList /> },
            { path: 'new', element: <StaffCreate /> },
            { path: '/:name/edit', element: <StaffCreate /> }
          ]
        },
        {
          path: 'employee',
          children: [
            { path: '/', element: <Navigate to="/dashboard/employee/list" replace /> },
            { path: 'list', element: <EmployeeList /> },
            { path: 'new', element: <EmployeeCreate /> },
            { path: '/:name/edit', element: <EmployeeCreate /> }
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
            { path: 'coral-type-list', element: <CoralTypeList /> }
          ]
        },
        {
          path: 'phases',
          children: [
            { path: '/', element: <Navigate to="/dashboard/phases/new" replace /> },
            { path: 'list', element: <PhaseList /> },
            { path: 'new', element: <PhasesCreate /> },
            { path: '/:name/edit', element: <PhasesCreate /> },
            { path: '/type/new', element: <PhasesTypeCreate /> }
          ]
        },
        {
          path: 'coralArea',
          children: [
            { path: '/', element: <Navigate to="/dashboard/coralarea/list" replace /> },
            { path: 'list', element: <CoraAreaList /> },
            { path: 'new', element: <CoralAreaCreate /> }
          ]
        },
        {
          path: 'site',
          children: [
            { path: '/', element: <Navigate to="/dashboard/site/list" replace /> },
            { path: 'list', element: <SiteList /> },
            { path: 'new', element: <SiteCreate /> },
            { path: '/:name/edit', element: <SiteCreate /> }
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
          path: 'technician',
          children: [
            { path: '/', element: <Navigate to="/dashboard/technician/list" replace /> },
            { path: 'list', element: <TechinicianList /> },
            { path: 'new', element: <TechinicianCreate /> },
            { path: '/:name/edit', element: <TechinicianCreate /> },
            { path: 'area', element: <TechnicianAreaCreate /> }
          ]
        },
        {
          path: 'garden',
          children: [
            { path: '/', element: <Navigate to="/dashboard/garden/list" replace /> },
            { path: 'list', element: <GardenList /> },
            { path: 'types', element: <GardenTypesList /> },
            { path: 'new', element: <GardenCreate /> },
            { path: 'site', element: <GardenTypeCreate /> },
            { path: 'type-new', element: <GardenTypeCreate /> },
            { path: 'types/:name/edit', element: <GardenTypeCreate /> },
            { path: '/:name/edit', element: <GardenCreate /> }
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
        },
        {
          path: 'diver',
          children: [
            { path: '/', element: <Navigate to="/dashboard/diver/list" replace /> },
            { path: 'list', element: <DiverList /> },
            { path: 'new', element: <DiverCreate /> },
            { path: '/:name/edit', element: <DiverCreate /> },
            { path: 'team', element: <DiverTeamList /> },
            { path: 'area', element: <DiverTeamAreaCreate /> }
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
      )
      // children: [
      //   { path: '/', element: <Navigate to="/dashboard/app" replace /> },
      //   { path: 'app', element: <GeneralApp /> },
      //   {
      //     path: 'area',
      //     children: [
      //       { path: '/', element: <Navigate to="/dashboard/area/list" replace /> },
      //       { path: 'list', element: <AreaList /> },
      //       { path: 'new', element: <AreaCreate /> },
      //       { path: '/:name/edit', element: <AreaCreate /> }
      //     ]
      //   },
      //   {
      //     path: 'coral',
      //     children: [
      //       { path: '/', element: <Navigate to="/dashboard/coral/list" replace /> },
      //       { path: 'list', element: <CoralList /> },
      //       { path: 'new', element: <CoralCreate /> },
      //       { path: 'type', element: <CoralType /> },
      //       { path: 'coral-type-list', element: <CoralTypeList /> }
      //     ]
      //   },
      //   {
      //     path: 'phases',
      //     children: [
      //       { path: '/', element: <Navigate to="/dashboard/phases/new" replace /> },
      //       // { path: 'list', element: <PhaseList /> },
      //       { path: 'new', element: <PhasesCreate /> },
      //       { path: '/:name/edit', element: <PhasesCreate /> },
      //       { path: '/type/new', element: <PhasesTypeCreate /> }
      //     ]
      //   },
      //   {
      //     path: 'coralArea',
      //     children: [
      //       { path: '/', element: <Navigate to="/dashboard/coralarea/list" replace /> },
      //       { path: 'list', element: <CoraAreaList /> },
      //       { path: 'new', element: <CoralAreaCreate /> }
      //     ]
      //   },
      //   {
      //     path: 'site',
      //     children: [
      //       { path: '/', element: <Navigate to="/dashboard/site/list" replace /> },
      //       { path: 'list', element: <SiteList /> },
      //       { path: 'site-new', element: <SiteCreate /> },
      //       { path: 'owners/:name/edit', element: <SiteCreate /> }
      //     ]
      //   },
      //   {
      //     path: 'technician',
      //     children: [
      //       { path: '/', element: <Navigate to="/dashboard/technician/list" replace /> },
      //       { path: 'list', element: <TechinicianList /> },
      //       { path: 'new', element: <TechinicianCreate /> },
      //       { path: '/:name/edit', element: <TechinicianCreate /> },
      //       { path: 'area', element: <TechnicianAreaCreate /> }
      //     ]
      //   },
      //   {
      //     path: 'garden',
      //     children: [
      //       { path: '/', element: <Navigate to="/dashboard/garden/list" replace /> },
      //       { path: 'list', element: <GardenList /> },
      //       { path: 'types', element: <GardenTypesList /> },
      //       { path: 'new', element: <GardenCreate /> },
      //       { path: 'type-new', element: <GardenTypeCreate /> },
      //       { path: 'types/:name/edit', element: <GardenTypeCreate /> },
      //       { path: '/:name/edit', element: <GardenCreate /> }
      //     ]
      //   },
      //   {
      //     path: 'group-mode',
      //     children: [
      //       { path: '/', element: <Navigate to="/dashboard/group-mode/list" replace /> },
      //       { path: 'list', element: <GroupModeList /> },
      //       { path: 'new', element: <GroupModeCreate /> },
      //       { path: '/:name/edit', element: <GroupModeCreate /> }
      //     ]
      //   },
      //   {
      //     path: 'categories',
      //     children: [
      //       { path: '/', element: <Navigate to="/dashboard/categories/list" replace /> },
      //       { path: 'list', element: <CategoriesList /> },
      //       { path: 'new', element: <CategoriesCreate /> },
      //       { path: '/:name/edit', element: <CategoriesCreate /> }
      //     ]
      //   },
      //   {
      //     path: 'diver',
      //     children: [
      //       { path: '/', element: <Navigate to="/dashboard/diver/list" replace /> },
      //       { path: 'list', element: <DiverList /> },
      //       { path: 'new', element: <DiverCreate /> },
      //       { path: '/:name/edit', element: <DiverCreate /> },
      //       { path: 'team', element: <DiverTeamList /> },
      //       { path: 'area', element: <DiverTeamAreaCreate /> }
      //     ]
      //   }
      // ]
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
const AccountCreate = Loadable(lazy(() => import('../pages/dashboard/AccountCreate')));
const StaffList = Loadable(lazy(() => import('../pages/dashboard/StaffList')));
const StaffCreate = Loadable(lazy(() => import('../pages/dashboard/StaffCreate')));
const EmployeeList = Loadable(lazy(() => import('../pages/dashboard/EmployeeList')));
const EmployeeCreate = Loadable(lazy(() => import('../pages/dashboard/EmployeeCreate')));
const AreaCreate = Loadable(lazy(() => import('../pages/dashboard/AreaCreate')));
const PhaseList = Loadable(lazy(() => import('../pages/dashboard/CoralPhaseList')));
const PhasesCreate = Loadable(lazy(() => import('../pages/dashboard/CoralPhases')));
const PhasesTypeCreate = Loadable(lazy(() => import('../pages/dashboard/CoralPhasesType')));
const CoraAreaList = Loadable(lazy(() => import('../pages/dashboard/CoralAreaList')));
const CoralAreaCreate = Loadable(lazy(() => import('../pages/dashboard/CoralAreaCreate')));
const CoralList = Loadable(lazy(() => import('../pages/dashboard/CoralList')));
const CoralCreate = Loadable(lazy(() => import('../pages/dashboard/CoralCreate')));
const CoralType = Loadable(lazy(() => import('../pages/dashboard/CoralType')));
const CoralTypeList = Loadable(lazy(() => import('../pages/dashboard/CoralTypeList')));
const GardenList = Loadable(lazy(() => import('../pages/dashboard/GardenList')));
const GroupModeList = Loadable(lazy(() => import('../pages/dashboard/GroupModeList')));
const GroupModeCreate = Loadable(lazy(() => import('../pages/dashboard/GroupModeCreate')));
const GroupRoleList = Loadable(lazy(() => import('../pages/dashboard/GroupRoleList')));
const GroupRoleCreate = Loadable(lazy(() => import('../pages/dashboard/GroupRoleCreate')));
const CategoriesList = Loadable(lazy(() => import('../pages/dashboard/CategoriesList')));
const CategoriesCreate = Loadable(lazy(() => import('../pages/dashboard/CategoriesCreate')));
const SiteList = Loadable(lazy(() => import('../pages/dashboard/SiteList')));
const GardenTypesList = Loadable(lazy(() => import('../pages/dashboard/GardenTypesList')));
const PartnerTypeList = Loadable(lazy(() => import('../pages/dashboard/PartnerTypeList')));
const PartnerList = Loadable(lazy(() => import('../pages/dashboard/PartnerList')));
const PartnerTypeCreate = Loadable(lazy(() => import('../pages/dashboard/PartnerTypeCreate')));
const PartnerCreate = Loadable(lazy(() => import('../pages/dashboard/PartnerCreate')));
const GardenCreate = Loadable(lazy(() => import('../pages/dashboard/GardenCreate')));
const SiteCreate = Loadable(lazy(() => import('../pages/dashboard/SiteCreate')));
const GardenTypeCreate = Loadable(lazy(() => import('../pages/dashboard/GardenTypeCreate')));
const DiverList = Loadable(lazy(() => import('../pages/dashboard/DiverList')));
const DiverCreate = Loadable(lazy(() => import('../pages/dashboard/DiverCreate')));
const DiverTeamList = Loadable(lazy(() => import('../pages/dashboard/DiverTeamList')));
const DiverTeamAreaCreate = Loadable(lazy(() => import('../pages/dashboard/DiverTeamAreaCreate')));
const TechinicianList = Loadable(lazy(() => import('../pages/dashboard/TechnicianList')));
const TechinicianCreate = Loadable(lazy(() => import('../pages/dashboard/TechnicianCreate')));
const TechnicianAreaCreate = Loadable(
  lazy(() => import('../pages/dashboard/TechnicianAreaCreate'))
);
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
