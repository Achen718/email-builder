import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store/store';
import { IAuthState } from './authSlice';

export const selectAuthReducer = (state: RootState): IAuthState => state.auth;

export const selectAuthLoading = createSelector(
  [selectAuthReducer],
  (auth) => auth.loading
);

export const selectAuthSuccess = createSelector(
  [selectAuthReducer],
  (auth) => auth.success
);

export const selectCurrentUser = createSelector(
  [selectAuthReducer],
  (auth) => auth.currentUser
);

export const selectAuthToken = createSelector(
  [selectAuthReducer],
  (auth) => auth.userToken
);

export const selectAuthLoadingAndCurrentUser = createSelector(
  [selectAuthLoading, selectCurrentUser],
  (loading, currentUser) => ({
    loading,
    currentUser,
  })
);
