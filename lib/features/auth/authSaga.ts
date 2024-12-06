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

function* userSignUpAsync({
  payload,
}: PayloadAction<{ firstName: string; email: string; password: string }>) {
  console.log(payload);
  try {
    const { firstName, email, password } = payload;
    const { user } = yield call(signUp, firstName, email, password);
    console.log(user);
    yield put(userSignUpSuccess(user));
  } catch (error) {
    yield put(userSignUpFailed((error as Error).message));
  }
}

function* userLoginAsync({
  payload,
}: PayloadAction<{ user: { email: string; password: string } }>): Generator {
  console.log(payload);
  try {
    const { email, password } = payload.user;
    const userData = yield call(userLogin, email, password);
    console.log(userData);
    yield put(userLoginSuccess(userData));
  } catch (error) {
    yield put(userLoginFailed((error as Error).message));
  }
}

export function* signInAfterSignUp(user) {
  yield call(userLoginAsync, user);
}

export function* onSignUpRequest() {
  yield takeLatest(AUTH_ACTION_TYPES.USER_SIGN_UP_REQUEST, userSignUpAsync);
}

export function* onSignUpSuccess() {
  yield takeLatest(AUTH_ACTION_TYPES.USER_SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* authSagas() {
  yield all([call(onSignUpRequest), call(onSignUpSuccess)]);
}
