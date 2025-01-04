import { takeLatest, put, all, call } from 'redux-saga/effects';
import {
  userSignUpSuccess,
  userSignUpFailed,
  userLoginSuccess,
  userLoginFailed,
} from './authActions';
import { AUTH_ACTION_TYPES } from './authTypes';
import { signUp, userLogin } from '@/services/auth/authService';
import { PayloadAction } from '@reduxjs/toolkit';

export interface IUserSignUpData extends IUserLoginData {
  firstName: string;
}
export interface IUserLoginData {
  email: string;
  password: string;
}
export interface IUserData {
  user: IUserLoginData;
}

function* handleUserLogin(email: string, password: string): Generator {
  try {
    const userData = yield call(userLogin, email, password);
    yield put(userLoginSuccess(userData));
  } catch (error) {
    yield put(userLoginFailed((error as Error).message));
  }
}

export function* userSignUpAsync({
  payload,
}: PayloadAction<IUserSignUpData>): Generator {
  try {
    const { firstName, email, password } = payload;
    const { user } = yield call(signUp, firstName, email, password);
    console.log(user);
    yield put(userSignUpSuccess(user));
  } catch (error) {
    yield put(userSignUpFailed((error as Error).message));
  }
}

export function* userLoginAsync({
  payload,
}: PayloadAction<IUserLoginData>): Generator {
  const { email, password } = payload;
  yield call(handleUserLogin, email, password);
}

export function* userLoginAfterSignUpAsync({
  payload,
}: PayloadAction<IUserData>): Generator {
  const { email, password } = payload.user;
  yield call(handleUserLogin, email, password);
}

export function* signInAfterSignUp(action: PayloadAction<IUserData>) {
  yield call(userLoginAfterSignUpAsync, action);
}

export function* onSignUpRequest() {
  yield takeLatest(AUTH_ACTION_TYPES.USER_SIGN_UP_REQUEST, userSignUpAsync);
}

export function* onSignUpSuccess() {
  yield takeLatest(AUTH_ACTION_TYPES.USER_SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* onLoginRequest() {
  yield takeLatest(AUTH_ACTION_TYPES.USER_LOGIN_REQUEST, userLoginAsync);
}

export function* authSagas() {
  yield all([
    call(onSignUpRequest),
    call(onSignUpSuccess),
    call(onLoginRequest),
  ]);
}
