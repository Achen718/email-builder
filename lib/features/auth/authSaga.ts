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

interface IUserSignUpData {
  firstName: string;
  email: string;
  password: string;
}
interface IUserData {
  email: string;
  password: string;
}

interface IUser {
  user: IUserData;
}

export function* userSignUpAsync({
  payload,
}: PayloadAction<IUserSignUpData>): Generator {
  try {
    const { firstName, email, password } = payload;
    const { user } = yield call(signUp, firstName, email, password);
    yield put(userSignUpSuccess(user));
  } catch (error) {
    yield put(userSignUpFailed((error as Error).message));
  }
}

export function* userLoginAsync(payload: IUser): Generator {
  try {
    const { email, password } = payload.user;
    const userData = yield call(userLogin, email, password);
    yield put(userLoginSuccess(userData));
  } catch (error) {
    yield put(userLoginFailed((error as Error).message));
  }
}

export function* signInAfterSignUp({ payload }: PayloadAction<IUser>) {
  yield call(userLoginAsync, payload);
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
