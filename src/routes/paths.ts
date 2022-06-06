// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify')
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  page404: '/404',
  page500: '/500'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics')
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all')
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    conversation: path(ROOTS_DASHBOARD, '/chat/:conversationKey')
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  coral: {
    root: path(ROOTS_DASHBOARD, '/coral'),
    list: path(ROOTS_DASHBOARD, '/coral/list'),
    new: path(ROOTS_DASHBOARD, '/coral/new'),
    type: path(ROOTS_DASHBOARD, '/coral/type'),
    listType: path(ROOTS_DASHBOARD, '/coral/coral-type-list')
  },
  account: {
    root: path(ROOTS_DASHBOARD, '/account'),
    list: path(ROOTS_DASHBOARD, '/account/list'),
    newUser: path(ROOTS_DASHBOARD, '/account/new'),
    editById: path(ROOTS_DASHBOARD, '/account/:name/edit')
  },
  phases: {
    root: path(ROOTS_DASHBOARD, '/phases'),
    list: path(ROOTS_DASHBOARD, '/phases/list'),
    new: path(ROOTS_DASHBOARD, '/phases/new'),
    typeNew: path(ROOTS_DASHBOARD, '/phases/type/new')
  },
  area: {
    root: path(ROOTS_DASHBOARD, '/area'),
    shop: path(ROOTS_DASHBOARD, '/area/shop'),
    product: path(ROOTS_DASHBOARD, '/area/:name'),
    productById: path(ROOTS_DASHBOARD, '/area/product/nike-air-force-1-ndestrukt'),
    list: path(ROOTS_DASHBOARD, '/area/list'),
    new: path(ROOTS_DASHBOARD, '/area/new'),
    newProvince: path(ROOTS_DASHBOARD, '/area/product/province'),
    editById: path(ROOTS_DASHBOARD, '/area/product/nike-blazer-low-77-vintage/edit'),
    checkout: path(ROOTS_DASHBOARD, '/area/checkout'),
    invoice: path(ROOTS_DASHBOARD, '/area/invoice')
  },
  coralArea: {
    root: path(ROOTS_DASHBOARD, '/coralarea'),
    list: path(ROOTS_DASHBOARD, '/coralarea/list'),
    new: path(ROOTS_DASHBOARD, '/coralarea/new')
  },
  site: {
    root: path(ROOTS_DASHBOARD, '/site'),
    list: path(ROOTS_DASHBOARD, '/site/list'),
    newSite: path(ROOTS_DASHBOARD, '/site/new'),
    editByIdSite: path(ROOTS_DASHBOARD, '/site/:name/edit')
  },
  garden: {
    root: path(ROOTS_DASHBOARD, '/garden'),
    list: path(ROOTS_DASHBOARD, '/garden/list'),
    typesList: path(ROOTS_DASHBOARD, '/garden/types'),
    newGarden: path(ROOTS_DASHBOARD, '/garden/new'),
    newGardenType: path(ROOTS_DASHBOARD, '/garden/type-new'),
    editByIdGarden: path(ROOTS_DASHBOARD, '/garden/:name/edit'),
    editByIdGardenType: path(ROOTS_DASHBOARD, '/garden/types/:name/edit')
  },
  group: {
    root: path(ROOTS_DASHBOARD, '/group-mode'),
    list: path(ROOTS_DASHBOARD, '/group-mode/list'),
    newGroupMode: path(ROOTS_DASHBOARD, '/group-mode/new'),
    editByIdGroupMode: path(ROOTS_DASHBOARD, '/group-mode/:name/edit')
  },
  partner: {
    root: path(ROOTS_DASHBOARD, '/partner'),
    list: path(ROOTS_DASHBOARD, '/partner/list'),
    new: path(ROOTS_DASHBOARD, '/partner/new'),
    editById: path(ROOTS_DASHBOARD, '/partner/:name/edit'),
    typeList: path(ROOTS_DASHBOARD, '/partner/types'),
    typeNew: path(ROOTS_DASHBOARD, '/partner/type-new')
  },
  diver: {
    root: path(ROOTS_DASHBOARD, '/diver'),
    list: path(ROOTS_DASHBOARD, '/diver/list'),
    newDiver: path(ROOTS_DASHBOARD, '/diver/new'),
    team: path(ROOTS_DASHBOARD, '/diver/team')
  }
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
