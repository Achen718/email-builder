import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userLogin } from './authActions';
interface IAuthState {
  userToken: string | null;
  currentUser: string | null;
  success: boolean;
  error: string | null;
  loading: boolean;
}

const initialState = {
  userToken: null,
  currentUser: null,
  success: false,
  error: null,
  loading: false,
} satisfies IAuthState;

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
        console.log(payload);
        state.loading = false;
        state.currentUser = payload;
        state.userToken = payload.token;
      })
      .addCase(userLogin.rejected, (state: IAuthState, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setAuthToken } = authSlice.actions;
export default authSlice.reducer;
