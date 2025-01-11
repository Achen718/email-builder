import { createAction } from '@reduxjs/toolkit';
import { AUTH_ACTION_TYPES } from './authTypes';

export const setCurrentUser = createAction(
  AUTH_ACTION_TYPES.SET_CURRENT_USER,
  (user, userToken) => ({ payload: { user, userToken } })
);

export const userSignUpRequest = createAction(
  AUTH_ACTION_TYPES.USER_SIGN_UP_REQUEST,
  ({ firstName, email, password }) => ({
    payload: {
      firstName,
      email,
      password,
    },
  })
);

export const userSignUpSuccess = createAction(
  AUTH_ACTION_TYPES.USER_SIGN_UP_SUCCESS,
  (user, userToken) => ({
    payload: { user, userToken },
  })
);

export const userSignUpFailed = createAction(
  AUTH_ACTION_TYPES.USER_SIGN_UP_FAILED,
  (error) => ({ payload: { error } })
);

export const userLoginRequest = createAction(
  AUTH_ACTION_TYPES.USER_LOGIN_REQUEST,
  (email: string, password: string) => ({ payload: { email, password } })
);

export const userLoginSuccess = createAction(
  AUTH_ACTION_TYPES.USER_LOGIN_SUCCESS,
  (user, userToken) => ({ payload: { user, userToken } })
);

export const userLoginFailed = createAction(
  AUTH_ACTION_TYPES.USER_LOGIN_FAILED,
  (error) => ({ payload: { error } })
);
