// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Label from '../../components/Label';
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  coral: getIcon('ic_coral'),
  coralArea: getIcon('ic_coral_area'),
  garden: getIcon('ic_garden'),
  diver: getIcon('ic_diver'),
  area: getIcon('ic_area'),
  phases: getIcon('ic_phases'),
  user: getIcon('ic_user'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  kanban: getIcon('ic_kanban')
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'general',
  //   items: [
  //     {
  //       title: 'app',
  //       path: PATH_DASHBOARD.general.app,
  //       icon: ICONS.dashboard
  //     },
  //     { title: 'e-commerce', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.ecommerce },
  //     { title: 'analytics', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics }
  //   ]
  // },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      {
        title: 'garden',
        path: PATH_DASHBOARD.garden.root,
        icon: ICONS.garden,
        children: [
          // { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
          // { title: 'product', path: PATH_DASHBOARD.eCommerce.productById },
          { title: 'list', path: PATH_DASHBOARD.garden.list }
        ]
      },
      {
        title: 'diver',
        path: PATH_DASHBOARD.diver.root,
        icon: ICONS.diver,
        children: [
          { title: 'list', path: PATH_DASHBOARD.diver.list }
          // { title: 'Create', path: PATH_DASHBOARD.diver.newDiver }
        ]
      },
      // MANAGEMENT : USER
      {
        title: 'coral',
        path: PATH_DASHBOARD.coral.root,
        icon: ICONS.coral,
        children: [
          // { title: 'cards', path: PATH_DASHBOARD.user.cards },
          { title: 'list', path: PATH_DASHBOARD.coral.list },
          { title: 'list type', path: PATH_DASHBOARD.coral.listType }
          // { title: 'type', path: PATH_DASHBOARD.coral.type }
          // { title: 'edit', path: PATH_DASHBOARD.user.editById },
          // { title: 'phases Type', path: PATH_DASHBOARD.user.phasesType },
          // { title: 'phases', path: PATH_DASHBOARD.user.phases }
        ]
      },
      // MANAGEMENT : Phases
      {
        title: 'phases',
        path: PATH_DASHBOARD.phases.root,
        icon: ICONS.phases,
        children: [
          { title: 'create', path: PATH_DASHBOARD.phases.new },
          { title: 'phases type create', path: PATH_DASHBOARD.phases.typeNew }
        ]
      },
      // MANAGEMENT : Coral Area
      {
        title: 'coral area',
        path: PATH_DASHBOARD.coralArea.root,
        icon: ICONS.coralArea,
        children: [
          { title: 'list', path: PATH_DASHBOARD.coralArea.list }
          // { title: 'create', path: PATH_DASHBOARD.coralArea.new }
        ]
      },

      // MANAGEMENT : Area
      {
        title: 'area',
        path: PATH_DASHBOARD.area.root,
        icon: ICONS.area,
        children: [
          { title: 'list', path: PATH_DASHBOARD.area.list }
          // { title: 'create', path: PATH_DASHBOARD.area.new }
        ]
      }
    ]
  }

  // APP
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'app',
  //   items: [
  //     {
  //       title: 'mail',
  //       path: PATH_DASHBOARD.mail.root,
  //       icon: ICONS.mail,
  //       info: <Label color="error">2</Label>
  //     },
  //     { title: 'chat', path: PATH_DASHBOARD.chat.root, icon: ICONS.chat },
  //     { title: 'calendar', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
  //     {
  //       title: 'kanban',
  //       path: PATH_DASHBOARD.kanban,
  //       icon: ICONS.kanban
  //     }
  //   ]
  // }
];

export default sidebarConfig;
