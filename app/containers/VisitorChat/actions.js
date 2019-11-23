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
  SET_VISITOR_CHAT_HISTORY,
  SHOW_VISITOR_CHAT_HISTORY,
  LOAD_VISITOR_CHAT_HISTORY,
  SET_MESSAGES,
  PREPEND_MESSAGES,
  SET_STAFF_TYPING,
  ADD_CURRENT_STAFF,
  REMOVE_CURRENT_STAFF,
  SET_CURRENT_STAFFS,
  ADD_ONLINE_STAFF,
  REMOVE_ONLINE_STAFF,
  SET_ONLINE_STAFFS,
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

export function convertAnonymousAccount(id, displayName, email, password) {
  return {
    type: CONVERT_ANONYMOUS_ACCOUNT,
    id,
    displayName,
    email,
    password,
  };
}

export function submitSettings(name, email, password, id) {
  return {
    type: SUBMIT_SETTINGS,
    name,
    email,
    password,
    id,
  }
}

export function setVisitorChatHistory(history) {
  return {
    type: SET_VISITOR_CHAT_HISTORY,
    history,
  }
}

export function showVisitorChatHistory() {
  return {
    type: SHOW_VISITOR_CHAT_HISTORY,
  }
}

export function loadVisitorChatHistory(lastMsgId, visitor, repeat) {
  return {
    type: LOAD_VISITOR_CHAT_HISTORY,
    lastMsgId,
    visitor,
    repeat,
  }
}

export function setMessages(messages) {
  return {
    type: SET_MESSAGES,
    messages,
  }
}

export function prependMessages(messages) {
  return {
    type: PREPEND_MESSAGES,
    messages,
  }
}

export function setStaffTyping(time) {
  return {
    type: SET_STAFF_TYPING,
    time,
  }
}

export function addCurrentStaff(staff) {
  return {
    type: ADD_CURRENT_STAFF,
    staff
  }
}

export function removeCurrentStaff(staffId) {
  return {
    type: REMOVE_CURRENT_STAFF,
    staffId
  }
}

export function setCurrentStaffs(staffs) {
  return {
    type: SET_CURRENT_STAFFS,
    staffs
  }
}

export function addOnlineStaff(staff) {
  return {
    type: ADD_ONLINE_STAFF,
    staff
  }
}

export function removeOnlineStaff(staffId) {
  return {
    type: REMOVE_ONLINE_STAFF,
    staffId
  }
}

export function setOnlineStaffs(staffs) {
  return {
    type: SET_ONLINE_STAFFS,
    staffs,
  }
}