import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer';
import { firebaseApi } from '@/lib/features/auth/auth-api';

export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(firebaseApi.middleware),
  });

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
