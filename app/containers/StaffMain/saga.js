import { REGISTER_STAFF, REFRESH_AUTH_TOKEN } from './constants';

import { takeLatest, call, put, select } from 'redux-saga/effects';
import { post, get } from '../../utils/api';
import { userLoggedIn } from '../App/actions';
import { push } from '../../utils/history';

function* login({ email, password }) {
  yield post('/');
}

function* registerStaff({ name, email, password, role }) {
  const [success, response] = yield post(
    '/users',
    {
      full_name: name,
      email,
      password,
      role_id: role,
    },
    response => response,
    e => e.response(),
  );
}

function* refreshAuthToken() {
  const [success, response] = yield post(
    '/refresh',
    {},
    response => response,
    e => e.response,
  );

  if (success) {
    yield localStorage.setItem('access_token', response.access_token);
  } else {
    yield put(userLoggedIn(false));
    yield push('/');
  }
}

// Individual exports for testing
export default function* staffMainSaga() {
  yield takeLatest(REGISTER_STAFF, registerStaff);
  yield takeLatest(REFRESH_AUTH_TOKEN, refreshAuthToken);
}
