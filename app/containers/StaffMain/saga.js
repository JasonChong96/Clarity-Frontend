import { put, takeLatest } from 'redux-saga/effects';
import { post, get, patch } from '../../utils/api';
import history from '../../utils/history';
import {
  userLoggedIn,
  userLoggedOut,
  setError,
  setSuccess,
  patchUserInfo,
} from '../App/actions';
import {
  REFRESH_AUTH_TOKEN,
  REGISTER_STAFF,
  LOAD_CHAT_HISTORY,
  LOG_OUT,
  LOAD_ALL_VOLUNTEERS,
  LOAD_ALL_SUPERVISORS,
  LOAD_ALL_VISITORS,
  SET_LAST_SEEN_MESSAGE_ID,
  LOAD_BOOKMARKED_CHATS,
  SET_VISITOR_BOOKMARK,
  LOAD_LAST_UNREAD,
  LOAD_MESSAGES_BEFORE_FOR_SUPERVISOR_PANEL,
  LOAD_MESSAGES_AFTER_FOR_SUPERVISOR_PANEL,
  SUBMIT_SETTINGS
} from './constants';
import {
  addMessageHistory,
  loadVolunteers,
  registerStaffSuccess,
  registerStaffFailure,
  loadSupervisors,
  addToAllVisitors,
  setMessagesForSupervisorPanel,
  addMessagesAfterForSupervisorPanel,
  addMessagesBeforeForSupervisorPanel,
  addVisitorsToBookmarkedChats,
  removeVisitorFromBookmarkedChats,
  loadMessagesAfterForSupervisorPanel,
  loadMessagesBeforeForSupervisorPanel,
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

function* loadAllVolunteers() {
  const [success, response] = yield get(
    '/users?role_id=3',
    response => response,
    e => e.response,
  );
  if (success) {
    console.log('success', response)
    yield put(loadVolunteers(response.data.data));
  } else {
    console.log(response)
  }
}

function* loadAllSupervisors() {
  const [success, response] = yield get(
    '/users?role_id=2',
    response => response,
    e => e.response,
  );
  if (success) {
    console.log('success', response)
    yield put(loadSupervisors(response.data.data));
  } else {
    console.log(response)
  }
}

function* logOut() {
  yield localStorage.removeItem('access_token');
  yield localStorage.removeItem('user');
  yield put(userLoggedOut());
  yield history.push('/staff/login');
}

function* loadLastUnread({ visitor }) {
  const [success, response] = yield get(
    '/visitors/' + visitor.id + '/messages' + '?starts_from_unread=true',
    response => response,
    e => e.response,
  );
  if (success) {
    response.data.data.forEach(content => {
      content.user = content.sender ? content.sender : visitor;
    });
    yield put(setMessagesForSupervisorPanel(visitor.id, response.data.data));
    if (response.data.data.length) {
      yield put(loadMessagesAfterForSupervisorPanel(visitor, response.data.data.slice(-1)[0].id))
      yield put(loadMessagesBeforeForSupervisorPanel(visitor, response.data.data[0].id))
    }
  }
}

function* loadChatForward({ visitor, lastMessageId }) {
  const [success, response] = yield get(
    '/visitors/' + visitor.id + '/messages' + '?after_id=' + lastMessageId,
    response => response,
    e => e.response,
  );
  if (success) {
    response.data.data.forEach(content => {
      content.user = content.sender ? content.sender : visitor;
    });
    if (response.data.data.length) {
      yield put(addMessagesAfterForSupervisorPanel(visitor.id, response.data.data));
    }
  }
}

function* loadChatBack({ visitor, firstMessageId }) {
  const [success, response] = yield get(
    '/visitors/' + visitor.id + '/messages' + '?before_id=' + firstMessageId,
    response => response,
    e => e.response,
  );
  if (success) {
    response.data.data.forEach(content => {
      content.user = content.sender ? content.sender : visitor;
    });
    if (response.data.data.length) {
      yield put(addMessagesBeforeForSupervisorPanel(visitor.id, response.data.data));
    }
  }
}

function* loadAllVisitors({ lastVisitorId }) {
  const [success, response] = yield get(
    lastVisitorId ? `/visitors?after_id=${lastVisitorId}` : '/visitors',
    response => response,
    e => e.response,
  );
  if (success) {
    yield put(addToAllVisitors(response.data.data));
  }
}

function* loadBookmarkedVisitors({ lastVisitorId }) {
  const [success, response] = yield get(
    lastVisitorId ? `/visitors/bookmarked?after_id=${lastVisitorId}` : '/visitors/bookmarked',
    response => response,
    e => e.response,
  );
  if (success) {
    yield put(addVisitorsToBookmarkedChats(response.data.data));
  }
}

function* setLastSeenMessageId({ visitorId, messageId }) {
  yield patch(
    `/visitors/${visitorId}/last_seen`,
    { last_seen_msg_id: messageId },
    response => response,
    e => e.response,
  );
}

function* setVisitorBookmark({ visitor, isBookmarked }) {
  const [success, response] = yield patch(
    `/visitors/${visitor.id}/bookmark`,
    { is_bookmarked: isBookmarked },
    response => response,
    e => e.response,
  );
  if (success) {
    if (response.data.data.is_bookmarked) {
      yield put(addVisitorsToBookmarkedChats([visitor]));
    } else {
      yield put(removeVisitorFromBookmarkedChats(visitor.id));
    }
  }
}

function* submitSettings({ name, password, id }) {
  const payload = {
    full_name: name,
    password
  }
  Object.keys(payload).forEach(key => {
    if (!payload[key] || !payload[key].length) {
      delete payload[key]
    }
  })
  const [success, response] = yield patch(
    `/users/${id}`,
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

// Individual exports for testing
export default function* staffMainSaga() {
  yield takeLatest(REGISTER_STAFF, registerStaff);
  yield takeLatest(REFRESH_AUTH_TOKEN, refreshAuthToken);
  yield takeLatest(LOAD_CHAT_HISTORY, loadChatHistory);
  yield takeLatest(LOAD_ALL_VOLUNTEERS, loadAllVolunteers);
  yield takeLatest(LOAD_ALL_SUPERVISORS, loadAllSupervisors);
  yield takeLatest(LOG_OUT, logOut);
  yield takeLatest(LOAD_ALL_VISITORS, loadAllVisitors);
  yield takeLatest(SET_LAST_SEEN_MESSAGE_ID, setLastSeenMessageId);
  yield takeLatest(LOAD_BOOKMARKED_CHATS, loadBookmarkedVisitors);
  yield takeLatest(SET_VISITOR_BOOKMARK, setVisitorBookmark);
  yield takeLatest(LOAD_LAST_UNREAD, loadLastUnread);
  yield takeLatest(LOAD_MESSAGES_BEFORE_FOR_SUPERVISOR_PANEL, loadChatBack);
  yield takeLatest(LOAD_MESSAGES_AFTER_FOR_SUPERVISOR_PANEL, loadChatForward);
  yield takeLatest(SUBMIT_SETTINGS, submitSettings);
}
