/*
 *
 * Home actions
 *
 */

import { DEFAULT_ACTION, LOGIN_ANONYMOUSLY } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function loginAnonymously(name) {
  return {
    type: LOGIN_ANONYMOUSLY,
    name,
  };
}
