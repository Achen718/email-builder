import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  userSignUpRequest,
  userSignUpSuccess,
  userSignUpFailed,
  userLoginRequest,
  userLoginSuccess,
  userLoginFailed,
} from './authActions';

export interface IAuthState {
  currentUser: string | null;
  success: boolean;
  error: string | null;
  loading: boolean;
}

const initialState: IAuthState = {
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
        state.currentUser = action.payload;
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
        state.currentUser = action.payload;
        state.success = true;
      })
      .addCase(userLoginFailed, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.success = false;
      });
  },
});

export const authReducer = authSlice.reducer;
