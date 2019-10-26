import { takeLatest, call, put, select } from 'redux-saga/effects';
import { REGISTER_PATIENT } from './constants';
import history from '../../utils/history';

import { post } from '../../utils/api';
import { registerPatientSuccess, registerPatientFailure } from './actions';
import { userLoggedIn } from '../App/actions';

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
    yield put(registerPatientSuccess())
    yield put(userLoggedIn(response.data))
    yield history.push('/patient/main')
  } else {
    let msg = 'Unable to reach the server, please try again later.'
    if (response) {
      msg = response.data.error
    }
    yield put(registerPatientFailure(msg))
  }
}

// Individual exports for testing
export default function* patientRegisterSaga() {
  yield takeLatest(REGISTER_PATIENT, registerPatient);
}
