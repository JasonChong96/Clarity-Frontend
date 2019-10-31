// import { take, call, put, select } from 'redux-saga/effects';

import { put, takeLatest } from 'redux-saga/effects';
import { post, patch } from 'utils/api';
import history from '../../utils/history';
import {
  userLoggedIn,
  userLoggedOut,
  patchUserInfo,
  setSuccess,
  setError,
} from '../App/actions';
import { REFRESH_AUTH_TOKEN } from '../StaffMain/constants';
import { LOG_OUT, CONVERT_ANONYMOUS_ACCOUNT } from './constants';

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

function* convertAnonymousAccount({ id, email, password }) {
  const [success, response] = yield patch(
    `/visitors/${id}`,
    {
      email,
      password,
      is_anonymous: false,
    },
    response => response,
    e => e.response,
  );
  if (success) {
    yield put(patchUserInfo(response.data));
    yield put(
      setSuccess({
        title: 'Registration successful!',
        description: `${name} has been successfully registered!`,
      }),
    );
  } else {
    let msg = 'Unable to reach the server, please try again later.';
    if (response && response.data) {
      msg = response.data.error[Object.keys(response.data.error)[0]][0];
    }
    yield put(
      setError({ title: 'Failed to register account', description: msg }),
    );
  }
}

// Individual exports for testing
export default function* visitorChatSaga() {
  yield takeLatest(REFRESH_AUTH_TOKEN, refreshAuthToken);
  yield takeLatest(LOG_OUT, logOut);
  yield takeLatest(CONVERT_ANONYMOUS_ACCOUNT, convertAnonymousAccount);
}
