import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import blogReducer from './slices/blog';
import coralReducer from './slices/coral';
import gardenReducer from './slices/garden';
import diverReducer from './slices/diver';
import productReducer from './slices/area1';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import areaReducer from './slices/area';
import partnerReducer from './slices/partner';
import accountReducer from './slices/account';

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
  mail: mailReducer,
  chat: chatReducer,
  blog: blogReducer,
  account: accountReducer,
  diver: diverReducer,
  area: areaReducer,
  garden: gardenReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  partner: partnerReducer,
  coral: coralReducer,
  product: persistReducer(productPersistConfig, productReducer)
});

export { rootPersistConfig, rootReducer };
