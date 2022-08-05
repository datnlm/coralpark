// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Label from '../../components/Label';
import SvgIconStyle from '../../components/SvgIconStyle';
import useLocales from '../../hooks/useLocales';
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
  partner: getIcon('ic_partner'),
  diver: getIcon('ic_diver'),
  area: getIcon('ic_area'),
  phases: getIcon('ic_phases'),
  user: getIcon('ic_user'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  kanban: getIcon('ic_kanban'),
  site: getIcon('ic_site')
};

export default function SidebarConfig() {
  const { translate } = useLocales();
  const sidebarConfig = [
    // GENERAL
    // ----------------------------------------------------------------------
    {
      subheader: '',
      items: [
        {
          title: translate('menu.sidebarConfig.subheader.dashboard'),
          path: PATH_DASHBOARD.general.app,
          icon: ICONS.dashboard
        },
        {
          title: translate('menu.sidebarConfig.subheader.sell'),
          path: PATH_DASHBOARD.group.list,
          icon: ICONS.ecommerce,
          children: [
            {
              title: translate('menu.sidebarConfig.title.group-mode'),
              icon: ICONS.analytics,
              path: PATH_DASHBOARD.group.list
            },
            {
              title: translate('menu.sidebarConfig.title.group-role'),
              path: PATH_DASHBOARD.group.listRole
            },
            {
              title: translate('menu.sidebarConfig.title.categories'),
              path: PATH_DASHBOARD.categories.list
            }
          ]
        },
        {
          title: translate('menu.sidebarConfig.subheader.partner'),
          path: PATH_DASHBOARD.partner.root,
          icon: ICONS.partner,
          children: [
            {
              title: translate('menu.sidebarConfig.title.partner'),
              path: PATH_DASHBOARD.partner.list
            },
            {
              title: translate('menu.sidebarConfig.title.partner-type'),
              path: PATH_DASHBOARD.partner.typeList
            }
          ]
        },

        {
          title: translate('menu.sidebarConfig.subheader.site'),
          path: PATH_DASHBOARD.site.root,
          icon: ICONS.site,
          children: [
            {
              title: translate('menu.sidebarConfig.title.site'),
              path: PATH_DASHBOARD.site.list
            },
            {
              title: translate('menu.sidebarConfig.title.garden'),
              path: PATH_DASHBOARD.site.garden
            },
            {
              title: translate('menu.sidebarConfig.title.garden-type'),
              path: PATH_DASHBOARD.site.typesList
            },
            {
              title: translate('menu.sidebarConfig.title.cell-type'),
              path: PATH_DASHBOARD.site.cellTypesList
            }
          ]
        },
        {
          title: translate('menu.sidebarConfig.subheader.user'),
          path: PATH_DASHBOARD.staff.root,
          icon: ICONS.user,
          children: [
            {
              title: translate('menu.sidebarConfig.title.diver'),
              path: PATH_DASHBOARD.staff.diverList
            },
            {
              title: translate('menu.sidebarConfig.title.diver-team'),
              path: PATH_DASHBOARD.staff.team
            },
            {
              title: translate('menu.sidebarConfig.title.technician'),
              path: PATH_DASHBOARD.staff.listTechnician
            },
            {
              title: translate('menu.sidebarConfig.title.site-manager'),
              path: PATH_DASHBOARD.staff.listSite
            },
            {
              title: translate('menu.sidebarConfig.title.employee-partner'),
              path: PATH_DASHBOARD.staff.listEmployeePartner
            },
            {
              title: translate('menu.sidebarConfig.title.employee'),
              path: PATH_DASHBOARD.staff.listEmployee
            },
            {
              title: translate('menu.sidebarConfig.title.all'),
              path: PATH_DASHBOARD.account.list
            }
          ]
        },
        // {
        //   title: translate('menu.sidebarConfig.subheader.user'),
        //   path: PATH_DASHBOARD.diver.root,
        //   icon: ICONS.user,
        //   children: [
        //     { title: translate('menu.sidebarConfig.title.diver'), path: PATH_DASHBOARD.diver.list },
        //     {
        //       title: translate('menu.sidebarConfig.title.diver-team'),
        //       path: PATH_DASHBOARD.diver.team
        //     },
        //     {
        //       title: translate('menu.sidebarConfig.title.technician'),
        //       path: PATH_DASHBOARD.technician.list
        //     },
        //     {
        //       title: translate('menu.sidebarConfig.title.site-manager'),
        //       path: PATH_DASHBOARD.staff.listSite
        //     },
        //     {
        //       title: translate('menu.sidebarConfig.title.employee-partner'),
        //       path: PATH_DASHBOARD.staff.listEmployeePartner
        //     },
        //     {
        //       title: translate('menu.sidebarConfig.title.employee'),
        //       path: PATH_DASHBOARD.staff.listEmployee
        //     },
        //     {
        //       title: translate('menu.sidebarConfig.title.all'),
        //       path: PATH_DASHBOARD.account.list
        //     }
        //   ]
        // },
        {
          title: translate('menu.sidebarConfig.subheader.coral'),
          path: PATH_DASHBOARD.coral.root,
          icon: ICONS.coral,
          children: [
            { title: translate('menu.sidebarConfig.title.coral'), path: PATH_DASHBOARD.coral.list },
            {
              title: translate('menu.sidebarConfig.title.coral-type'),
              path: PATH_DASHBOARD.coral.listType
            },
            {
              title: translate('menu.sidebarConfig.title.coral-phase'),
              path: PATH_DASHBOARD.coral.coralPhaselist
            },
            {
              title: translate('menu.sidebarConfig.title.coral-health'),
              path: PATH_DASHBOARD.coral.listHealth
            }
          ]
        },
        {
          title: translate('menu.sidebarConfig.subheader.area'),
          path: PATH_DASHBOARD.area.list,
          icon: ICONS.area
        }
      ]
    }
  ];
  return sidebarConfig;
}
