import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import coralReducer from './slices/coral';
import gardenReducer from './slices/garden';
import diverReducer from './slices/diver';
import areaReducer from './slices/area';
import partnerReducer from './slices/partner';
import accountReducer from './slices/account';
import groupModeReducer from './slices/groupMode';
import categoriesReducer from './slices/categories';
import technicianReducer from './slices/technician';
import employeeReducer from './slices/employee';
import cellReducer from './slices/cell';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout']
};

const rootReducer = combineReducers({
  account: accountReducer,
  diver: diverReducer,
  area: areaReducer,
  garden: gardenReducer,
  partner: partnerReducer,
  coral: coralReducer,
  groupMode: groupModeReducer,
  categories: categoriesReducer,
  technician: technicianReducer,
  employee: employeeReducer,
  cell: cellReducer
});

export { rootPersistConfig, rootReducer };
