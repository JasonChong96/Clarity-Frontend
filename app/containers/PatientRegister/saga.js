import { put, takeLatest } from 'redux-saga/effects';
import { post } from '../../utils/api';
import history from '../../utils/history';
import { userLoggedIn } from '../App/actions';
import { registerPatientFailure, registerPatientSuccess } from './actions';
import { REGISTER_PATIENT } from './constants';

function* registerPatient({ name, email, password }) {
  const [success, response] = yield post(
    '/visitors',
    {
      name,
      email,
      password,
    },
    response => response,
    e => e.response,
  );
  if (success) {
    yield put(registerPatientSuccess());
    yield put(userLoggedIn({ user: response.data }));
    yield history.push('/visitor/main');
  } else {
    let msg = 'Unable to reach the server, please try again later.';
    if (response) {
      msg = response.data.error[Object.keys(response.data.error)[0]][0];
    }
    yield put(registerPatientFailure(msg));
  }
}

// Individual exports for testing
export default function* patientRegisterSaga() {
  yield takeLatest(REGISTER_PATIENT, registerPatient);
}
