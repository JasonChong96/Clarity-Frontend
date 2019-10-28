import { put, takeLatest } from 'redux-saga/effects';
import { post, get } from '../../utils/api';
import { push } from '../../utils/history';
import { userLoggedIn } from '../App/actions';
import { REFRESH_AUTH_TOKEN, REGISTER_STAFF, LOAD_CHAT_HISTORY } from './constants';
import { addMessageHistory } from './actions';

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
    yield localStorage.setItem('access_token', response.data.access_token);
  } else {
    yield put(userLoggedIn(false));
    yield push('/');
  }
}

function* loadChatHistory({ lastMsgId, visitor }) {
  const [success, response] = yield get(
    '/visitors/' + visitor.id + '/messages' + '?before_id=' + lastMsgId,
    response => response,
    e => e.response,
  );
  console.log(response.data);
  if (success) {
    response.data.data.forEach(content => {
      content.user = content.sender ? content.sender : visitor;
    })
    yield put(addMessageHistory(visitor.id, response.data.data));
  }
}

// Individual exports for testing
export default function* staffMainSaga() {
  yield takeLatest(REGISTER_STAFF, registerStaff);
  yield takeLatest(REFRESH_AUTH_TOKEN, refreshAuthToken);
  yield takeLatest(LOAD_CHAT_HISTORY, loadChatHistory);
}
