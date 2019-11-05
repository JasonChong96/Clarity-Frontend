import { takeLatest, put } from 'redux-saga/effects';
import { LOGIN_ANONYMOUSLY } from './constants';
import { post } from 'utils/api';
import { userLoggedIn } from '../App/actions';
import history from 'utils/history';

function* loginAnonymously({ name }) {
  const [success, response] = yield post(
    '/anonymous/login',
    { name },
    response => response,
    e => e.response,
  );
  if (success) {
    yield put(userLoggedIn(response.data));
    yield history.push('/visitor/main');
    yield localStorage.setItem('access_token', response.data.access_token);
  } else {
    let msg = 'Unable to reach the server, please try again later.';
    if (response) {
      msg = response.data.error[Object.keys(response.data.error)[0]][0];
    }
    yield put(setError({ title: 'Anonymous Login Failed', description: msg }));
  }
}

// Individual exports for testing
export default function* homeSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(LOGIN_ANONYMOUSLY, loginAnonymously);
}
