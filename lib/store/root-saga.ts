import { all, call } from 'redux-saga/effects';
import { authSagas } from '../features/auth/authSaga';

export function* rootSaga() {
  yield all([call(authSagas)]);
}
