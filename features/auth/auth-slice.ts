import { createSlice } from '@reduxjs/toolkit';
import { UserData } from '@/features/auth/hooks/useAuth';

export interface IAuthState {
  currentUser: UserData | null;
  success: boolean;
  error: string | null;
  authLoading: boolean;
  userToken: string | null;
}

const initialState: IAuthState = {
  userToken: null,
  currentUser: null,
  success: false,
  error: null,
  authLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.currentUser = action.payload.user;
      state.userToken = action.payload.token;
      state.error = null;
      state.authLoading = false;
      state.success = true;
    },
    clearCredentials: (state) => {
      state.currentUser = null;
      state.userToken = null;
      state.authLoading = false;
      state.success = false;
    },
    // For handling auth errors outside of RTK Query
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.authLoading = false;
      state.success = false;
    },
    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },
  },
});

export const { setCredentials, clearCredentials, setAuthLoading } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
