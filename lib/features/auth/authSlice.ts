import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  userSignUpRequest,
  userSignUpSuccess,
  userSignUpFailed,
  userLoginRequest,
  userLoginSuccess,
  userLoginFailed,
  setCurrentUserStart,
  setCurrentUserSuccess,
} from './authActions';

export interface IAuthState {
  currentUser: string | null;
  success: boolean;
  error: string | null;
  loading: boolean;
  userToken: string | null;
}

const initialState: IAuthState = {
  userToken: null,
  currentUser: null,
  success: false,
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userSignUpRequest, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(userSignUpSuccess, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.success = true;
      })
      .addCase(userSignUpFailed, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.success = false;
      })
      .addCase(userLoginRequest, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(userLoginSuccess, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.success = true;
        state.userToken = action.payload.userToken;
      })
      .addCase(userLoginFailed, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.success = false;
      })
      .addCase(setCurrentUserStart, (state) => {
        state.loading = true;
      })
      .addCase(setCurrentUserSuccess, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.userToken = action.payload.userToken;
      });
  },
});

export const authReducer = authSlice.reducer;
