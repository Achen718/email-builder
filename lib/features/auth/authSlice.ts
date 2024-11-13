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
    setAuthToken(state, { payload }: PayloadAction<{ userToken: string }>) {
      state.userToken = payload.userToken;
    },
    clearAuthToken(state) {
      state.userToken = null;
    },
  },
});

export const { setAuthToken } = authSlice.actions;
export default authSlice.reducer;
