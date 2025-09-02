import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from '@store/authReducer.js';
import uiReducer from '@store/uiReducer';
import menuReducer from '@store/menuReducer.js';
import flightReducer from '@store/flightReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  menu: menuReducer,
  ui: uiReducer,
  flight: flightReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['menu'], // do not persist menu reducer
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/FLUSH',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
