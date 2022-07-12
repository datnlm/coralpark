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
  coral: {
    root: path(ROOTS_DASHBOARD, '/coral'),
    list: path(ROOTS_DASHBOARD, '/coral/list'),
    new: path(ROOTS_DASHBOARD, '/coral/new'),
    type: path(ROOTS_DASHBOARD, '/coral/type'),
    listType: path(ROOTS_DASHBOARD, '/coral/coral-type-list'),
    listHealth: path(ROOTS_DASHBOARD, '/coral/health'),
    healthNew: path(ROOTS_DASHBOARD, '/coral/health/new')
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
    typeNew: path(ROOTS_DASHBOARD, '/phases/type/new'),
    editById: path(ROOTS_DASHBOARD, '/phases/:name/edit')
  },
  area: {
    root: path(ROOTS_DASHBOARD, '/area'),
    shop: path(ROOTS_DASHBOARD, '/area/shop'),
    product: path(ROOTS_DASHBOARD, '/area/:name'),
    list: path(ROOTS_DASHBOARD, '/area/list'),
    new: path(ROOTS_DASHBOARD, '/area/new'),
    newProvince: path(ROOTS_DASHBOARD, '/area/product/province')
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
  staff: {
    root: path(ROOTS_DASHBOARD, '/staff'),
    listEmployee: path(ROOTS_DASHBOARD, '/staff/employee/list'),
    listSite: path(ROOTS_DASHBOARD, '/staff/site-manager/list'),
    listEmployeePartner: path(ROOTS_DASHBOARD, '/staff/employee-partner/list'),
    newEmployeePartner: path(ROOTS_DASHBOARD, '/staff/employee-partner/new'),
    editByEmployeePartner: path(ROOTS_DASHBOARD, '/staff/employee-partner/:name/edit'),
    newEmployee: path(ROOTS_DASHBOARD, '/staff/employee/new'),
    newSite: path(ROOTS_DASHBOARD, '/staff/site-manager/new'),
    editByEmployeeId: path(ROOTS_DASHBOARD, '/staff/employeee/:name/edit'),
    editBySiteId: path(ROOTS_DASHBOARD, '/staff/site-manager/:name/edit')
  },
  employee: {
    root: path(ROOTS_DASHBOARD, '/employee'),
    list: path(ROOTS_DASHBOARD, '/employee/list'),
    new: path(ROOTS_DASHBOARD, '/employee/new'),
    editById: path(ROOTS_DASHBOARD, '/employee/:name/edit')
  },
  technician: {
    root: path(ROOTS_DASHBOARD, '/technician'),
    list: path(ROOTS_DASHBOARD, '/technician/list'),
    new: path(ROOTS_DASHBOARD, '/technician/new'),
    area: path(ROOTS_DASHBOARD, '/technician/area')
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
  cell: {
    root: path(ROOTS_DASHBOARD, '/cell'),
    typesList: path(ROOTS_DASHBOARD, '/cell/types'),
    newCellType: path(ROOTS_DASHBOARD, '/cell/type-new'),
    editCellTypeById: path(ROOTS_DASHBOARD, '/cell/types/:name/edit')
  },
  group: {
    root: path(ROOTS_DASHBOARD, '/group-mode'),
    list: path(ROOTS_DASHBOARD, '/group-mode/list'),
    newGroupMode: path(ROOTS_DASHBOARD, '/group-mode/new'),
    editByIdGroupMode: path(ROOTS_DASHBOARD, '/group-mode/:name/edit'),
    role: path(ROOTS_DASHBOARD, '/group-role'),
    listRole: path(ROOTS_DASHBOARD, '/group-role/list'),
    newGroupRole: path(ROOTS_DASHBOARD, '/group-role/new'),
    editByIdGroupRole: path(ROOTS_DASHBOARD, '/group-role/:name/edit')
  },
  categories: {
    root: path(ROOTS_DASHBOARD, '/categories'),
    list: path(ROOTS_DASHBOARD, '/categories/list'),
    new: path(ROOTS_DASHBOARD, '/categories/new')
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
    team: path(ROOTS_DASHBOARD, '/diver/team'),
    area: path(ROOTS_DASHBOARD, '/diver/area')
  }
};
