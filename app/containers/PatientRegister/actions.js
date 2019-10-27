/*
 *
 * PatientRegister actions
 *
 */

import {
  DEFAULT_ACTION,
  REGISTER_PATIENT,
  REGISTER_PATIENT_FAILURE,
  REGISTER_PATIENT_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function registerPatient(name, email, password) {
  return {
    type: REGISTER_PATIENT,
    name,
    email,
    password,
  };
}

export function registerPatientFailure(error) {
  return {
    type: REGISTER_PATIENT_FAILURE,
    error,
  };
}
export function registerPatientSuccess() {
  return {
    type: REGISTER_PATIENT_SUCCESS,
  };
}
