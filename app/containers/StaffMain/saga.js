import { put, takeLatest } from 'redux-saga/effects';
import { post } from '../../utils/api';
import { push } from '../../utils/history';
import { userLoggedIn } from '../App/actions';
import { REFRESH_AUTH_TOKEN, REGISTER_STAFF } from './constants';


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
