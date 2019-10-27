/*
 *
 * StaffMain actions
 *
 */

import {
  DEFAULT_ACTION,
  REGISTER_STAFF,
  SET_UNCLAIMED_CHATS,
  ADD_ACTIVE_CHAT,
  REMOVE_ACTIVE_CHAT,
  RESET,
  REFRESH_AUTH_TOKEN,
  REMOVE_UNCLAIMED_CHAT,
  ADD_UNCLAIMED_CHAT,
  ADD_MESSAGE_FROM_UNCLAIMED_CHAT,
} from './constants';

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
  };
}

export function setUnclaimedChats(unclaimedChats) {
  return {
    type: SET_UNCLAIMED_CHATS,
    unclaimedChats,
  };
}

export function addActiveChat(chat) {
  return {
    type: ADD_ACTIVE_CHAT,
    chat,
  };
}

export function removeActiveChat(visitor) {
  return {
    type: REMOVE_ACTIVE_CHAT,
    visitor,
  };
}

export function reset() {
  return {
    type: RESET,
  };
}

export function refreshAuthToken() {
  return {
    type: REFRESH_AUTH_TOKEN,
  };
}

export function removeUnclaimedChat(room) {
  return {
    type: REMOVE_UNCLAIMED_CHAT,
    room,
  };
}

export function addUnclaimedChat(room) {
  return {
    type: ADD_UNCLAIMED_CHAT,
    room,
  };
}

export function addMessageFromUnclaimedChat(visitor, content) {
  return {
    type: ADD_MESSAGE_FROM_UNCLAIMED_CHAT,
    visitor,
    content,
  };
}

export function addMessageFromActiveChat(visitor, content) {
  return {
    type: ADD_MESSAGE_FROM_ACTIVE_CHAT,
    visitor,
    content,
  };
}
