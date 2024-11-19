import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userLogin, userSignUp } from './authActions';

interface IAuthState {
  userToken: string | null;
  currentUser: string | null;
  success: boolean;
  error: string | null;
  loading: boolean;
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
    setAuthToken(state, action: PayloadAction<string | null>) {
      state.userToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state: IAuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state: IAuthState, { payload }) => {
        state.loading = false;
        state.currentUser = payload;
        state.userToken = payload.token;
      })
      .addCase(userLogin.rejected, (state: IAuthState, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(userSignUp.pending, (state: IAuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userSignUp.fulfilled, (state: IAuthState) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(userSignUp.rejected, (state: IAuthState, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export const { setAuthToken } = authSlice.actions;
export default authSlice.reducer;
