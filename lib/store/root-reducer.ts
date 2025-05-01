import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from '@/lib/features/auth/authSlice';
import { firebaseApi } from '@/lib/services/api/firebaseApiSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  [firebaseApi.reducerPath]: firebaseApi.reducer,
});
