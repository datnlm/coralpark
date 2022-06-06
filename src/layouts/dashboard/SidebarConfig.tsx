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
  kanban: getIcon('ic_kanban')
};

export default function SidebarConfig() {
  const { translate } = useLocales();
  const sidebarConfig = [
    // MANAGEMENT
    // ----------------------------------------------------------------------
    {
      subheader: translate('menu.sidebarConfig.subheader.management'),
      items: [
        {
          title: translate('menu.sidebarConfig.title.diver'),
          path: PATH_DASHBOARD.diver.root,
          icon: ICONS.diver,
          children: [
            { title: translate('menu.sidebarConfig.diver.list'), path: PATH_DASHBOARD.diver.list },
            { title: translate('menu.sidebarConfig.diver.team'), path: PATH_DASHBOARD.diver.team }
          ]
        },
        {
          title: translate('menu.sidebarConfig.title.partner'),
          path: PATH_DASHBOARD.partner.root,
          icon: ICONS.partner,
          children: [
            {
              title: translate('menu.sidebarConfig.partner.list'),
              path: PATH_DASHBOARD.partner.list
            }
          ]
        }
      ]
    }
  ];
  return sidebarConfig;
}
