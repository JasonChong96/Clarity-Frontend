/*
 *
 * StaffMain actions
 *
 */

import { DEFAULT_ACTION, REGISTER_STAFF } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function registerStaff(name, email, password, role) {
  return {
    type: REGISTER_STAFF,
    name,
    email,
    password,
    role,
  }
}
