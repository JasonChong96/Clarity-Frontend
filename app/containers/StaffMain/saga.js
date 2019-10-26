import { REGISTER_STAFF } from "./constants";

import { takeLatest, call, put, select } from 'redux-saga/effects';
import { post, get } from '../../utils/api';

function* login({ email, password }) {
  yield post('/')
}

function* registerStaff({ name, email, password, role }) {
  yield post('/users', {
    full_name: name,
    email,
    password,
    role_id: role,
  }, response => { console.log('response') }
    , e => console.log(e.response))
}

// Individual exports for testing
export default function* staffMainSaga() {
  yield takeLatest(REGISTER_STAFF, registerStaff);
}
