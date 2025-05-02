import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from '@/lib/features/auth/auth-slice';
import { firebaseApi } from '@/lib/features/auth/auth-api';

export const rootReducer = combineReducers({
  auth: authReducer,
  [firebaseApi.reducerPath]: firebaseApi.reducer,
});
