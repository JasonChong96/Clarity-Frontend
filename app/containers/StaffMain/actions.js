/*
 *
 * StaffMain actions
 *
 */

import {
  ADD_ACTIVE_CHAT,
  ADD_MESSAGE_FROM_UNCLAIMED_CHAT,
  ADD_UNCLAIMED_CHAT,
  DEFAULT_ACTION,
  REFRESH_AUTH_TOKEN,
  REGISTER_STAFF,
  REMOVE_ACTIVE_CHAT,
  REMOVE_UNCLAIMED_CHAT,
  RESET,
  SET_UNCLAIMED_CHATS,
  ADD_MESSAGE_HISTORY,
  REMOVE_UNCLAIMED_CHAT_BY_VISITOR_ID,
  ADD_MESSAGE_FROM_ACTIVE_CHAT,
  REGISTER_STAFF_SUCCESS,
  ADD_MESSAGE_FROM_UNCLAIMED_CHAT_BY_VISITOR_ID,
  ADD_MESSAGE_FROM_ACTIVE_CHAT_BY_VISITOR_ID,
  LOAD_CHAT_HISTORY,
  SHOW_LOADED_MESSAGE_HISTORY,
  REGISTER_STAFF_FAILURE,
  LOG_OUT,
  SUBMIT_SETTINGS,
  CLEAR_UNREAD_COUNT,
  INCREMENT_UNREAD_COUNT,
} from './constants';
import { REGISTER_PATIENT_FAILURE } from '../PatientRegister/constants';

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

export function registerStaffSuccess() {
  return {
    type: REGISTER_STAFF_SUCCESS,
  };
}

export function registerStaffFailure() {
  return {
    type: REGISTER_STAFF_FAILURE,
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

export function refreshAuthToken(isStaff) {
  return {
    type: REFRESH_AUTH_TOKEN,
    isStaff,
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

export function addMessageFromActiveChat(roomId, data) {
  return {
    type: ADD_MESSAGE_FROM_ACTIVE_CHAT,
    roomId,
    data,
  };
}

export function setHasMoreMessages(visitorId, hasMoreMessages) {
  return {
    type: SET_HAS_MORE_MESSAGES,
    visitorId,
    hasMoreMessages,
  };
}

export function addMessageHistory(visitorId, messages) {
  return {
    type: ADD_MESSAGE_HISTORY,
    visitorId,
    messages,
  };
}

export function removeUnclaimedChatByVisitorId(visitorId) {
  return {
    type: REMOVE_UNCLAIMED_CHAT_BY_VISITOR_ID,
    visitorId,
  };
}

export function addMessageFromActiveChatByVisitorId(visitorId, data) {
  return {
    type: ADD_MESSAGE_FROM_ACTIVE_CHAT_BY_VISITOR_ID,
    visitorId,
    data,
  };
}

export function addMessageFromUnclaimedChatByVisitorId(visitorId, data) {
  return {
    type: ADD_MESSAGE_FROM_UNCLAIMED_CHAT_BY_VISITOR_ID,
    visitorId,
    data,
  };
}

export function loadChatHistory(lastMsgId, visitor) {
  return {
    type: LOAD_CHAT_HISTORY,
    visitor,
    lastMsgId,
  };
}

export function showLoadedMessageHistory(visitorId) {
  return {
    type: SHOW_LOADED_MESSAGE_HISTORY,
    visitorId,
  };
}

export function staffLogOut() {
  return {
    type: LOG_OUT,
  };
}

export function submitSettings(name, password, id) {
  return {
    type: SUBMIT_SETTINGS,
    name,
    password,
    id,
  };
}

export function clearUnreadCount(visitorId) {
  return {
    type: CLEAR_UNREAD_COUNT,
    visitorId,
  };
}

export function incrementUnreadCount(visitorId) {
  return {
    type: INCREMENT_UNREAD_COUNT,
    visitorId,
  };
}
