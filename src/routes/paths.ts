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
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components'
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
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    newUser: path(ROOTS_DASHBOARD, '/user/new'),
    editById: path(ROOTS_DASHBOARD, '/user/ada-lindgren/edit'),
    account: path(ROOTS_DASHBOARD, '/user/account')
  },
  phases: {
    root: path(ROOTS_DASHBOARD, '/phases'),
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
  diver: {
    root: path(ROOTS_DASHBOARD, '/diver'),
    list: path(ROOTS_DASHBOARD, '/diver/list'),
    newDiver: path(ROOTS_DASHBOARD, '/diver/new')
  }
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
