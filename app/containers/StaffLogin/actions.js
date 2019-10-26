/*
 *
 * StaffLogin actions
 *
 */

import { DEFAULT_ACTION, VOLUNTEER_LOGIN, VOLUNTEER_LOGIN_FAILURE, VOLUNTEER_LOGIN_SUCCESS } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function volunteerLogin(email, password) {
  return {
    type: VOLUNTEER_LOGIN,
    email,
    password,
  }
}
export function volunteerLoginSuccess() {
  return {
    type: VOLUNTEER_LOGIN_SUCCESS,
  }
}
export function volunteerLoginFailure(error) {
  return {
    type: VOLUNTEER_LOGIN_FAILURE,
    error,
  }
}
