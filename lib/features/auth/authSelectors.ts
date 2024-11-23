import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store/store';
import { IAuthState } from './authSlice';

export const selectAuthReducer = (state: RootState): IAuthState => state.auth;

export const selectLoading = createSelector(
  [selectAuthReducer],
  (auth) => auth.loading
);

export const selectCurrentUser = createSelector(
  [selectAuthReducer],
  (auth) => auth.currentUser
);

export const selectAuthLoadingAndCurrentUser = createSelector(
  [selectLoading, selectCurrentUser],
  (loading, currentUser) => ({
    loading,
    currentUser,
  })
);
