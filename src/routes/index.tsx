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
        { path: 'ecommerce', element: <GeneralEcommerce /> },
        {
          path: 'analytics',
          element: <GeneralAnalytics />
        },
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
            { path: 'new', element: <PhasesCreate /> },
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
          path: 'mail',
          children: [
            { path: '/', element: <Navigate to="/dashboard/mail/all" replace /> },
            { path: 'label/:customLabel', element: <Mail /> },
            { path: 'label/:customLabel/:mailId', element: <Mail /> },
            { path: ':systemLabel', element: <Mail /> },
            { path: ':systemLabel/:mailId', element: <Mail /> }
          ]
        },
        {
          path: 'chat',
          children: [
            { path: '/', element: <Chat /> },
            { path: 'new', element: <Chat /> },
            { path: ':conversationKey', element: <Chat /> }
          ]
        },
        { path: 'calendar', element: <Calendar /> },
        { path: 'kanban', element: <Kanban /> },
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
          path: 'diver',
          children: [
            { path: '/', element: <Navigate to="/dashboard/diver/list" replace /> },
            { path: 'list', element: <DiverList /> },
            { path: 'new', element: <DiverCreate /> },
            { path: '/:name/edit', element: <DiverCreate /> }
          ]
        }
      ]
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: 'pricing', element: <Pricing /> },
        { path: 'payment', element: <Payment /> },
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
        { path: 'app', element: <GeneralApp /> },
        { path: 'ecommerce', element: <GeneralEcommerce /> },
        {
          path: 'analytics',
          element: <GeneralAnalytics />
        },
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
          path: 'coral',
          children: [
            { path: '/', element: <Navigate to="/dashboard/coral/list" replace /> },
            { path: 'list', element: <CoralList /> },
            { path: 'new', element: <CoralCreate /> },
            { path: 'type', element: <CoralType /> },
            { path: 'coral-type-list', element: <CoralTypeList /> }
          ]
        },
        {
          path: 'phases',
          children: [
            { path: '/', element: <Navigate to="/dashboard/phases/new" replace /> },
            { path: 'new', element: <PhasesCreate /> },
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
            { path: 'site-new', element: <SiteCreate /> },
            { path: 'owners/:name/edit', element: <SiteCreate /> }
          ]
        },
        {
          path: 'garden',
          children: [
            { path: '/', element: <Navigate to="/dashboard/garden/list" replace /> },
            { path: 'list', element: <GardenList /> },
            { path: 'types', element: <GardenTypesList /> },
            { path: 'new', element: <GardenCreate /> },
            { path: 'type-new', element: <GardenTypeCreate /> },
            { path: 'types/:name/edit', element: <GardenTypeCreate /> },
            { path: '/:name/edit', element: <GardenCreate /> }
          ]
        },
        {
          path: 'diver',
          children: [
            { path: '/', element: <Navigate to="/dashboard/diver/list" replace /> },
            { path: 'list', element: <DiverList /> },
            { path: 'new', element: <DiverCreate /> },
            { path: '/:name/edit', element: <DiverCreate /> }
          ]
        }
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
const GeneralEcommerce = Loadable(lazy(() => import('../pages/dashboard/GeneralEcommerce')));
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
const AreaList = Loadable(lazy(() => import('../pages/dashboard/AreaList')));
const AreaCreate = Loadable(lazy(() => import('../pages/dashboard/AreaCreate')));
const PhasesCreate = Loadable(lazy(() => import('../pages/dashboard/CoralPhases')));
const PhasesTypeCreate = Loadable(lazy(() => import('../pages/dashboard/CoralPhasesType')));
const CoraAreaList = Loadable(lazy(() => import('../pages/dashboard/CoralAreaList')));
const CoralAreaCreate = Loadable(lazy(() => import('../pages/dashboard/CoralAreaCreate')));
const CoralList = Loadable(lazy(() => import('../pages/dashboard/CoralList')));
const CoralCreate = Loadable(lazy(() => import('../pages/dashboard/CoralCreate')));
const CoralType = Loadable(lazy(() => import('../pages/dashboard/CoralType')));
const CoralTypeList = Loadable(lazy(() => import('../pages/dashboard/CoralTypeList')));
const GardenList = Loadable(lazy(() => import('../pages/dashboard/GardenList')));
const SiteList = Loadable(lazy(() => import('../pages/dashboard/SiteList')));
const GardenTypesList = Loadable(lazy(() => import('../pages/dashboard/GardenTypesList')));
const GardenCreate = Loadable(lazy(() => import('../pages/dashboard/GardenCreate')));
const SiteCreate = Loadable(lazy(() => import('../pages/dashboard/SiteCreate')));
const GardenTypeCreate = Loadable(lazy(() => import('../pages/dashboard/GardenTypeCreate')));
const DiverList = Loadable(lazy(() => import('../pages/dashboard/DiverList')));
const DiverCreate = Loadable(lazy(() => import('../pages/dashboard/DiverCreate')));
const Chat = Loadable(lazy(() => import('../pages/dashboard/Chat')));
const Mail = Loadable(lazy(() => import('../pages/dashboard/Mail')));
const Calendar = Loadable(lazy(() => import('../pages/dashboard/Calendar')));
const Kanban = Loadable(lazy(() => import('../pages/dashboard/Kanban')));
// Main
// const LandingPage = Loadable(lazy(() => import('../pages/LandingPage')));
// const About = Loadable(lazy(() => import('../pages/About')));
// const Contact = Loadable(lazy(() => import('../pages/Contact')));
// const Faqs = Loadable(lazy(() => import('../pages/Faqs')));
const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Pricing = Loadable(lazy(() => import('../pages/Pricing')));
const Payment = Loadable(lazy(() => import('../pages/Payment')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
// Components
// const ComponentsOverview = Loadable(lazy(() => import('../pages/ComponentsOverview')));
// const Color = Loadable(
//   lazy(() => import('../pages/components-overview/foundations/FoundationColors'))
// );
// const Typography = Loadable(
//   lazy(() => import('../pages/components-overview/foundations/FoundationTypography'))
// );
// const Shadows = Loadable(
//   lazy(() => import('../pages/components-overview/foundations/FoundationShadows'))
// );
// const Grid = Loadable(
//   lazy(() => import('../pages/components-overview/foundations/FoundationGrid'))
// );
// const Icons = Loadable(
//   lazy(() => import('../pages/components-overview/foundations/FoundationIcons'))
// );
// const Accordion = Loadable(
//   lazy(() => import('../pages/components-overview/material-ui/Accordion'))
// );
// const Alert = Loadable(lazy(() => import('../pages/components-overview/material-ui/Alert')));
// const Autocomplete = Loadable(
//   lazy(() => import('../pages/components-overview/material-ui/Autocomplete'))
// );
// const Avatar = Loadable(lazy(() => import('../pages/components-overview/material-ui/Avatar')));
// const Badge = Loadable(lazy(() => import('../pages/components-overview/material-ui/Badge')));
// const Breadcrumb = Loadable(
//   lazy(() => import('../pages/components-overview/material-ui/Breadcrumb'))
// );
// const Buttons = Loadable(lazy(() => import('../pages/components-overview/material-ui/buttons')));
// const Checkbox = Loadable(
//   lazy(() => import('../pages/components-overview/material-ui/Checkboxes'))
// );
// const Chip = Loadable(lazy(() => import('../pages/components-overview/material-ui/chips')));
// const Dialog = Loadable(lazy(() => import('../pages/components-overview/material-ui/dialog')));
// const Label = Loadable(lazy(() => import('../pages/components-overview/material-ui/Label')));
// const List = Loadable(lazy(() => import('../pages/components-overview/material-ui/Lists')));
// const Menu = Loadable(lazy(() => import('../pages/components-overview/material-ui/Menus')));
// const Pagination = Loadable(
//   lazy(() => import('../pages/components-overview/material-ui/Pagination'))
// );
// const Pickers = Loadable(lazy(() => import('../pages/components-overview/material-ui/pickers')));
// const Popover = Loadable(lazy(() => import('../pages/components-overview/material-ui/Popover')));
// const Progress = Loadable(lazy(() => import('../pages/components-overview/material-ui/progress')));
// const RadioButtons = Loadable(
//   lazy(() => import('../pages/components-overview/material-ui/RadioButtons'))
// );
// const Rating = Loadable(lazy(() => import('../pages/components-overview/material-ui/Rating')));
// const Slider = Loadable(lazy(() => import('../pages/components-overview/material-ui/Slider')));
// const Snackbar = Loadable(lazy(() => import('../pages/components-overview/material-ui/Snackbar')));
// const Stepper = Loadable(lazy(() => import('../pages/components-overview/material-ui/stepper')));
// const Switches = Loadable(lazy(() => import('../pages/components-overview/material-ui/Switches')));
// const Table = Loadable(lazy(() => import('../pages/components-overview/material-ui/table')));
// const Tabs = Loadable(lazy(() => import('../pages/components-overview/material-ui/Tabs')));
// const Textfield = Loadable(
//   lazy(() => import('../pages/components-overview/material-ui/textfield'))
// );
// const Timeline = Loadable(lazy(() => import('../pages/components-overview/material-ui/Timeline')));
// const Tooltip = Loadable(lazy(() => import('../pages/components-overview/material-ui/Tooltip')));
// const TransferList = Loadable(
//   lazy(() => import('../pages/components-overview/material-ui/transfer-list'))
// );
// const TreeView = Loadable(lazy(() => import('../pages/components-overview/material-ui/TreeView')));
// const DataGrid = Loadable(lazy(() => import('../pages/components-overview/material-ui/data-grid')));
// //
// const Charts = Loadable(lazy(() => import('../pages/components-overview/extra/Charts')));
// const Map = Loadable(lazy(() => import('../pages/components-overview/extra/Map')));
// const Editor = Loadable(lazy(() => import('../pages/components-overview/extra/Editor')));
// const CopyToClipboard = Loadable(
//   lazy(() => import('../pages/components-overview/extra/CopyToClipboard'))
// );
// const Upload = Loadable(lazy(() => import('../pages/components-overview/extra/Upload')));
// const Carousel = Loadable(lazy(() => import('../pages/components-overview/extra/Carousel')));
// const MultiLanguage = Loadable(
//   lazy(() => import('../pages/components-overview/extra/MultiLanguage'))
// );
// const Animate = Loadable(lazy(() => import('../pages/components-overview/extra/animate')));
// const MegaMenu = Loadable(lazy(() => import('../pages/components-overview/extra/MegaMenu')));
