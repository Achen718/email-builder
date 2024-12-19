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

interface IUserSignUpData extends IUserLoginData {
  firstName: string;
}
interface IUserLoginData {
  email: string;
  password: string;
}

interface IUser {
  user: IUserLoginData;
}

export function* userSignUpAsync({ payload }: PayloadAction<IUserSignUpData>) {
  try {
    const { firstName, email, password } = payload;
    const { user } = yield call(signUp, firstName, email, password);
    yield put(userSignUpSuccess(user));
  } catch (error) {
    yield put(userSignUpFailed((error as Error).message));
  }
}

export function* userLoginAsync({
  payload,
}: PayloadAction<IUserLoginData>): Generator {
  try {
    console.log(payload);
    const { email, password } = payload;
    const userData = yield call(userLogin, email, password);
    console.log(userData);
    yield put(userLoginSuccess(userData));
  } catch (error) {
    console.log(error);
    yield put(userLoginFailed((error as Error).message));
  }
}

export function* signInAfterSignUp(action: PayloadAction<IUserSignUpData>) {
  yield call(userLoginAsync, action);
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
