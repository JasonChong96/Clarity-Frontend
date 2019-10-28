// import { take, call, put, select } from 'redux-saga/effects';

import { put, takeLatest } from 'redux-saga/effects';
import { post } from '../../utils/api';
import history from '../../utils/history';
import { userLoggedIn, userLoggedOut } from '../App/actions';
import { REFRESH_AUTH_TOKEN } from '../StaffMain/constants';
import { LOG_OUT } from './constants';

function* refreshAuthToken({ isStaff }) {
  const [success, response] = yield post(
    '/refresh',
    {},
    response => response,
    e => e.response,
  );
  if (success) {
    yield localStorage.setItem('access_token', response.data.access_token);
  } else {
    yield put(userLoggedOut());
    yield history.push(isStaff ? '/staff/login' : '/patient/login');
  }
}

function* logOut() {
  yield localStorage.removeItem('access_token');
  yield localStorage.removeItem('user');
  yield put(userLoggedOut());
  yield history.push('/patient/login');
}

// Individual exports for testing
export default function* visitorChatSaga() {
  yield takeLatest(REFRESH_AUTH_TOKEN, refreshAuthToken);
  yield takeLatest(LOG_OUT, logOut);
}
