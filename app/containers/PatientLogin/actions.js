/*
 *
 * PatientLogin actions
 *
 */

import {
  DEFAULT_ACTION,
  VISITOR_LOGIN_FAILURE,
  VISITOR_LOGIN_SUCCESS,
  VISITOR_LOGIN,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function visitorLogin(email, password) {
  return {
    type: VISITOR_LOGIN,
    email,
    password,
  };
}

export function visitorLoginFailure(error) {
  return {
    type: VISITOR_LOGIN_FAILURE,
    error,
  };
}

export function visitorLoginSuccess() {
  return {
    type: VISITOR_LOGIN_SUCCESS,
  };
}
