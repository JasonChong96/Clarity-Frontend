/*
 *
 * PatientRegister actions
 *
 */

import { DEFAULT_ACTION, REGISTER_PATIENT } from './constants';

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
