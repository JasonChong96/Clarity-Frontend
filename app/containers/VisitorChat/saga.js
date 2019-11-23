// import { take, call, put, select } from 'redux-saga/effects';

import { put, takeLatest } from 'redux-saga/effects';
import { post, patch, get } from 'utils/api';
import history from '../../utils/history';
import {
  userLoggedIn,
  userLoggedOut,
  patchUserInfo,
  setSuccess,
  setError,
} from '../App/actions';
import { REFRESH_AUTH_TOKEN } from '../StaffMain/constants';
import { LOG_OUT, CONVERT_ANONYMOUS_ACCOUNT, SUBMIT_SETTINGS, LOAD_VISITOR_CHAT_HISTORY } from './constants';
import { setMessages, setVisitorChatHistory, prependMessages } from './actions';

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
    yield history.push(isStaff ? '/staff/login' : '/visitor/');
  }
}

function* logOut() {
  yield localStorage.removeItem('access_token');
  yield localStorage.removeItem('user');
  yield put(userLoggedOut());
  yield history.push('/visitor/');
}

function* convertAnonymousAccount({ id, displayName, email, password }) {
  const [success, response] = yield patch(
    `/visitors/${id}`,
    {
      name: displayName,
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

function* submitSettings({ name, password, id }) {
  const payload = {
    name,
    password
  }
  Object.keys(payload).forEach(key => {
    if (!payload[key] || !payload[key].length) {
      delete payload[key]
    }
  })
  const [success, response] = yield patch(
    `/visitors/${id}`,
    payload,
    response => response,
    e => e.response,
  );
  if (success) {
    yield put(patchUserInfo(response.data.data));
    yield put(
      setSuccess({
        title: 'Settings changed successfully!',
        description: ``,
      }),
    );
  } else {
    let msg = 'Unable to reach the server, please try again later.';
    if (response && response.data) {
      msg = response.data.error[Object.keys(response.data.error)[0]][0];
    }
    yield put(
      setError({ title: 'Failed to change settings', description: msg }),
    );
  }
}

function* loadChatHistory({ lastMsgId, visitor, repeat }) {
  const [success, response] = yield get(
    '/visitors/' + visitor.id + '/messages' + (lastMsgId ? ('?before_id=' + lastMsgId) : ''),
    response => response,
    e => e.response,
  );
  if (success) {
    response.data.data.forEach(content => {
      content.user = content.sender ? content.sender : visitor;
    });
    if (!repeat) {
      yield put(setVisitorChatHistory(response.data.data));
    } else {
      yield put(prependMessages(response.data.data));
      if (response.data.data.length) {
        yield loadChatHistory({ lastMsgId: response.data.data[0].id, visitor });
      }
    }
  }
}

// Individual exports for testing
export default function* visitorChatSaga() {
  yield takeLatest(REFRESH_AUTH_TOKEN, refreshAuthToken);
  yield takeLatest(LOG_OUT, logOut);
  yield takeLatest(CONVERT_ANONYMOUS_ACCOUNT, convertAnonymousAccount);
  yield takeLatest(SUBMIT_SETTINGS, submitSettings);
  yield takeLatest(LOAD_VISITOR_CHAT_HISTORY, loadChatHistory);
}
