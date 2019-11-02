/*
 *
 * VisitorChat actions
 *
 */

import {
  ADD_CHAT_MESSAGE,
  DEFAULT_ACTION,
  SET_STAFF_JOINED,
  SET_FIRST_MSG,
  LOG_OUT,
  RESET,
  CONVERT_ANONYMOUS_ACCOUNT,
  SUBMIT_SETTINGS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function addChatMessage(message) {
  return {
    type: ADD_CHAT_MESSAGE,
    message,
  };
}

export function setFirstMsg(firstMsg) {
  return {
    type: SET_FIRST_MSG,
    firstMsg,
  };
}

export function setStaffJoined(staffJoined) {
  return {
    type: SET_STAFF_JOINED,
    staffJoined,
  };
}

export function logOut() {
  return {
    type: LOG_OUT,
  };
}

export function reset() {
  return {
    type: RESET,
  };
}

export function convertAnonymousAccount(id, email, password) {
  return {
    type: CONVERT_ANONYMOUS_ACCOUNT,
    id,
    email,
    password,
  };
}

export function submitSettings(name, password, id) {
  return {
    type: SUBMIT_SETTINGS,
    name,
    password,
    id,
  }
}