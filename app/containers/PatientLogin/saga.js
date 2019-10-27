import { put, takeLatest } from 'redux-saga/effects';
import { post } from '../../utils/api';
import history from '../../utils/history';
import { setError, userLoggedIn } from '../App/actions';
import { visitorLoginSuccess } from './actions';
import { VISITOR_LOGIN } from './constants';

function* visitorLogin({ email, password }) {
  const [success, response] = yield post(
    '/visitor/login',
    {
      email,
      password,
    },
    response => response,
    e => e.response,
  );
  if (success) {
    yield put(visitorLoginSuccess());
    yield put(userLoggedIn(response.data));
    yield history.push('/patient/main');
  } else {
    let msg = 'Unable to reach the server, please try again later.';
    if (response) {
      msg = response.data.error[Object.keys(response.data.error)[0]][0];
    }
    yield put(setError({ title: 'Login Failed', description: msg }));
  }
}

// Individual exports for testing
export default function* patientLoginSaga() {
  yield takeLatest(VISITOR_LOGIN, visitorLogin);
  // See example in containers/HomePage/saga.js
}
