import { takeLatest, call, put, select } from 'redux-saga/effects';
import { REGISTER_PATIENT } from './constants';

import { post } from '../../utils/api';

function* registerPatient({ name, email, password }) {
  yield post(
    '/visitors',
    {
      name,
      email,
      password,
    },
    response => {},
    console.log,
  );
}

// Individual exports for testing
export default function* patientRegisterSaga() {
  yield takeLatest(REGISTER_PATIENT, registerPatient);
}
