import { put, takeLatest } from 'redux-saga/effects';
import { post, get } from '../../utils/api';
import history from '../../utils/history';
import {
  userLoggedIn,
  userLoggedOut,
  setError,
  setSuccess,
} from '../App/actions';
import {
  REFRESH_AUTH_TOKEN,
  REGISTER_STAFF,
  LOAD_CHAT_HISTORY,
  LOG_OUT,
} from './constants';
import {
  addMessageHistory,
  registerStaffSuccess,
  registerStaffFailure,
} from './actions';
import { registerPatientFailure } from '../PatientRegister/actions';

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
    e => e.response,
  );
  if (success) {
    yield put(registerStaffSuccess());
    yield put(
      setSuccess({
        title: 'Registration successful!',
        description: `${name} has been successfully registered!`,
      }),
    );
  } else {
    let msg = 'Unable to reach the server, please try again later.';
    if (response) {
      msg = response.data.error[Object.keys(response.data.error)[0]][0];
    }
    yield put(registerStaffFailure());
    yield put(
      setError({ title: 'Failed to register account', description: msg }),
    );
  }
}

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

function* loadChatHistory({ lastMsgId, visitor }) {
  const [success, response] = yield get(
    '/visitors/' + visitor.id + '/messages' + '?before_id=' + lastMsgId,
    response => response,
    e => e.response,
  );
  if (success) {
    response.data.data.forEach(content => {
      content.user = content.sender ? content.sender : visitor;
    });
    yield put(addMessageHistory(visitor.id, response.data.data));
  }
}

function* logOut() {
  yield localStorage.removeItem('access_token');
  yield localStorage.removeItem('user');
  yield put(userLoggedOut());
  yield history.push('/staff/login');
}

// Individual exports for testing
export default function* staffMainSaga() {
  yield takeLatest(REGISTER_STAFF, registerStaff);
  yield takeLatest(REFRESH_AUTH_TOKEN, refreshAuthToken);
  yield takeLatest(LOAD_CHAT_HISTORY, loadChatHistory);
  yield takeLatest(LOG_OUT, logOut);
}
