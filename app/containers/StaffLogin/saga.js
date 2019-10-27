// import { take, call, put, select } from 'redux-saga/effects';

import { takeLatest, put } from 'redux-saga/effects';
import { VOLUNTEER_LOGIN } from './constants';
import { post } from '../../utils/api';
import { userLoggedIn } from '../App/actions';
import { volunteerLoginFailure, volunteerLoginSuccess } from './actions';
import history from '../../utils/history';

// Individual exports for testing
function* staffLogin({ email, password }) {
  const [success, response] = yield post(
    '/login',
    {
      email,
      password,
    },
    res => {
      localStorage.setItem('access_token', res.data.access_token);
      return res;
    },
    e => e.response,
  );
  if (success) {
    yield put(volunteerLoginSuccess());
    yield put(userLoggedIn(response.data));
    yield history.push('/staff/main');
  } else {
    let msg = 'Unable to reach the server, please try again later.';
    if (response) {
      msg = response.data.error[Object.keys(response.data.error)[0]][0];
    }
    yield put(volunteerLoginFailure(msg));
  }
}

export default function* staffLoginSaga() {
  yield takeLatest(VOLUNTEER_LOGIN, staffLogin);
}
