import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from '@/features/auth/auth-slice';
import { firebaseApi } from '@/features/auth/auth-api';

export const rootReducer = combineReducers({
  auth: authReducer,
  [firebaseApi.reducerPath]: firebaseApi.reducer,
});
