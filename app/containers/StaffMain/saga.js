import { REGISTER_STAFF } from "./constants";

import { takeLatest, call, put, select } from 'redux-saga/effects';
import { post } from '../../utils/api';

function* registerStaff({ name, email, password, role }) {
  yield post('/users', {
    name,
    email,
    password,
    role_id: role,
  }, response => { }
    , console.log)
}

// Individual exports for testing
export default function* staffMainSaga() {
  yield takeLatest(REGISTER_STAFF, registerStaff);
}
