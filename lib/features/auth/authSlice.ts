import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAuthState {
  userToken: string | null;
  userInfo: string | null;
}

const initialState: IAuthState = {
  userToken: null,
  userInfo: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken(state, action: PayloadAction<string>) {
      state.userToken = action.payload;
    },
    clearAuthToken(state) {
      state.userToken = null;
    },
  },
});

export const { setAuthToken } = authSlice.actions;
export default authSlice.reducer;
