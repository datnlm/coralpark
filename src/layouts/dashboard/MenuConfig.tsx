import { Icon } from '@iconify/react';
import fileFill from '@iconify/icons-eva/file-fill';

import SvgIconStyle from 'components/SvgIconStyle';
import { MegaMenuItemProps } from '../../@types/mega-menu';
import useLocales from '../../hooks/useLocales';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// import SvgIconStyle from '../SvgIconStyle';
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
  site: getIcon('ic_site'),
  partner: getIcon('ic_partner'),
  area: getIcon('ic_area'),
  phases: getIcon('ic_phases'),
  user: getIcon('ic_user'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  kanban: getIcon('ic_kanban')
};

const ICON_SIZE = {
  width: '100%',
  height: '100%'
};

export default function MegaMenuConfig() {
  const { translate } = useLocales();
  const menuConfig: MegaMenuItemProps[] = [
    {
      title: translate('menu.mega.title.site'),
      path: PATH_DASHBOARD.garden.root,
      icon: ICONS.site,
      children: [
        {
          subheader: translate('menu.mega.subheader.site'),
          items: [
            { title: translate('menu.mega.site.list'), path: PATH_DASHBOARD.site.list },
            { title: translate('menu.mega.site.create'), path: PATH_DASHBOARD.site.newSite }
            // { title: translate('menu.sidebarConfig.site.list'), path: PATH_DASHBOARD.site.list }
          ]
        }
      ]
    },
    {
      title: translate('menu.mega.title.technician'),
      path: PATH_DASHBOARD.technician.root,
      icon: ICONS.site,
      children: [
        {
          subheader: translate('menu.mega.subheader.technician'),
          items: [
            { title: translate('menu.mega.technician.list'), path: PATH_DASHBOARD.technician.list },
            {
              title: translate('menu.mega.technician.create'),
              path: PATH_DASHBOARD.technician.new
            },
            { title: translate('menu.mega.technician.area'), path: PATH_DASHBOARD.technician.area }
            // { title: translate('menu.sidebarConfig.site.list'), path: PATH_DASHBOARD.site.list }
          ]
        }
      ]
    },
    {
      title: translate('menu.mega.title.staff'),
      path: PATH_DASHBOARD.staff.root,
      icon: ICONS.user,
      children: [
        {
          subheader: translate('menu.mega.subheader.staff'),
          items: [
            { title: translate('menu.mega.staff.list'), path: PATH_DASHBOARD.staff.list },
            {
              title: translate('menu.mega.staff.create'),
              path: PATH_DASHBOARD.staff.new
            }
          ]
        },
        {
          subheader: translate('menu.mega.subheader.employee'),
          items: [
            { title: translate('menu.mega.employee.list'), path: PATH_DASHBOARD.employee.list },
            {
              title: translate('menu.mega.employee.create'),
              path: PATH_DASHBOARD.employee.new
            }
          ]
        }
      ]
    },
    {
      title: translate('menu.mega.title.garden'),
      path: PATH_DASHBOARD.garden.root,
      icon: ICONS.garden,
      children: [
        {
          subheader: translate('menu.mega.subheader.garden'),
          items: [
            { title: translate('menu.mega.garden.list'), path: PATH_DASHBOARD.garden.list },
            { title: translate('menu.mega.garden.create'), path: PATH_DASHBOARD.garden.newGarden }
          ]
        },
        {
          subheader: translate('menu.mega.subheader.type'),
          items: [
            { title: translate('menu.mega.garden.list'), path: PATH_DASHBOARD.garden.typesList },
            {
              title: translate('menu.mega.garden.create'),
              path: PATH_DASHBOARD.garden.newGardenType
            }
          ]
        }
      ]
    },
    {
      title: translate('menu.mega.title.partner'),
      path: PATH_DASHBOARD.partner.root,
      icon: ICONS.partner,
      children: [
        {
          subheader: translate('menu.mega.subheader.type'),
          items: [
            { title: translate('menu.mega.partner.list'), path: PATH_DASHBOARD.partner.typeList },
            { title: translate('menu.mega.partner.create'), path: PATH_DASHBOARD.partner.typeNew }
            // { title: translate('menu.sidebarConfig.site.list'), path: PATH_DASHBOARD.site.list }
          ]
        }
      ]
    },
    {
      title: translate('menu.mega.title.coral'),
      path: PATH_DASHBOARD.coral.root,
      icon: ICONS.coral,
      children: [
        {
          subheader: translate('menu.mega.subheader.coral'),
          items: [
            { title: translate('menu.mega.coral.list'), path: PATH_DASHBOARD.coral.list },
            { title: translate('menu.mega.coral.create'), path: PATH_DASHBOARD.coral.new }
          ]
        },
        {
          subheader: translate('menu.mega.subheader.coral-type'),
          items: [
            { title: translate('menu.mega.coral.list'), path: PATH_DASHBOARD.coral.listType },
            { title: translate('menu.mega.coral.create'), path: PATH_DASHBOARD.coral.type }
          ]
        },
        {
          subheader: translate('menu.mega.subheader.phase'),
          items: [
            { title: translate('menu.mega.coral.list'), path: PATH_DASHBOARD.phases.list },
            { title: translate('menu.mega.coral.create'), path: PATH_DASHBOARD.phases.new },
            { title: translate('menu.mega.coral.phase'), path: PATH_DASHBOARD.phases.typeNew }
          ]
        },
        {
          subheader: translate('menu.mega.subheader.area'),
          items: [{ title: translate('menu.mega.area.create'), path: PATH_DASHBOARD.coralArea.new }]
        }
      ]
    },
    {
      title: translate('menu.mega.title.group-mode'),
      path: PATH_DASHBOARD.group.root,
      icon: ICONS.ecommerce,
      children: [
        {
          subheader: translate('menu.mega.subheader.group-mode'),
          items: [
            { title: translate('menu.mega.group-mode.list'), path: PATH_DASHBOARD.group.list },
            {
              title: translate('menu.mega.group-mode.create'),
              path: PATH_DASHBOARD.group.newGroupMode
            }
          ]
        },
        {
          subheader: translate('menu.mega.subheader.group-role'),
          items: [
            { title: translate('menu.mega.group-role.list'), path: PATH_DASHBOARD.group.listRole },
            {
              title: translate('menu.mega.group-role.create'),
              path: PATH_DASHBOARD.group.newGroupRole
            }
          ]
        }
      ]
    },
    {
      title: translate('menu.mega.title.categories'),
      path: PATH_DASHBOARD.categories.root,
      icon: ICONS.ecommerce,
      children: [
        {
          subheader: translate('menu.mega.subheader.categories'),
          items: [
            { title: translate('menu.mega.categories.list'), path: PATH_DASHBOARD.categories.list },
            {
              title: translate('menu.mega.categories.create'),
              path: PATH_DASHBOARD.categories.new
            }
          ]
        }
      ]
    },
    {
      title: translate('menu.mega.title.area'),
      path: PATH_DASHBOARD.area.root,
      icon: ICONS.area,
      children: [
        {
          subheader: translate('menu.mega.subheader.area'),
          items: [
            { title: translate('menu.mega.area.list'), path: PATH_DASHBOARD.area.list },
            { title: translate('menu.mega.area.create'), path: PATH_DASHBOARD.area.new }
          ]
        }
      ]
    },
    {
      title: translate('menu.mega.title.account'),
      path: PATH_DASHBOARD.account.root,
      icon: ICONS.user,
      children: [
        {
          subheader: translate('menu.mega.subheader.account'),
          items: [
            { title: translate('menu.mega.account.list'), path: PATH_DASHBOARD.account.list },
            { title: translate('menu.mega.account.create'), path: PATH_DASHBOARD.account.newUser }
          ]
        }
      ]
    }
  ];

  return menuConfig;
}
