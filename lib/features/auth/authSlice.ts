import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  reducers: {
    setCredentials: (state, action) => {
      state.currentUser = action.payload.user;
      state.userToken = action.payload.token;
      state.error = null;
      state.loading = false;
      state.success = true;
    },
    clearCredentials: (state) => {
      state.currentUser = null;
      state.userToken = null;
      state.success = false;
    },
    // For handling auth errors outside of RTK Query
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.success = false;
    },
  },
});

export const { setCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;
