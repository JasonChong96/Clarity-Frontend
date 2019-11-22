/*
 *
 * VisitorChat reducer
 *
 */
import produce from 'immer';
import {
  ADD_CHAT_MESSAGE,
  DEFAULT_ACTION,
  SET_FIRST_MSG,
  SET_STAFF_JOINED,
  LOG_OUT,
  RESET,
  SET_VISITOR_CHAT_HISTORY,
  SHOW_VISITOR_CHAT_HISTORY,
  SET_MESSAGES,
  PREPEND_MESSAGES,
  SET_STAFF_TYPING,
  SET_CURRENT_STAFFS,
  SET_ONLINE_STAFFS,
  ADD_ONLINE_STAFF,
  ADD_CURRENT_STAFF,
  REMOVE_ONLINE_STAFF,
  REMOVE_CURRENT_STAFF,
} from './constants';

export const initialState = {
  messages: [],
  firstMsg: true,
  staffJoined: false,
  loadedHistory: [],
  currentStaffs: [],
  onlineStaffs: [],
  staffTypingTime: 0,
};

/* eslint-disable default-case, no-param-reassign */
const visitorChatReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case ADD_CHAT_MESSAGE:
        draft.messages.push(action.message);
        break;
      case SET_FIRST_MSG:
        draft.firstMsg = action.firstMsg;
        break;
      case SET_STAFF_JOINED:
        draft.staffJoined = action.staffJoined;
        break;
      case RESET:
        return initialState;
      case SET_VISITOR_CHAT_HISTORY:
        draft.loadedHistory = action.history;
        break;
      case SHOW_VISITOR_CHAT_HISTORY:
        draft.messages = draft.loadedHistory.concat(draft.messages);
        draft.loadedHistory = [];
        break;
      case SET_MESSAGES:
        draft.messages = action.messages;
        break;
      case PREPEND_MESSAGES:
        draft.messages = action.messages.concat(draft.messages);
        break;
      case SET_STAFF_TYPING:
        draft.staffTypingTime = action.time;
        break;
      case SET_CURRENT_STAFFS:
        draft.currentStaffs = action.staffs;
        break;
      case SET_ONLINE_STAFFS:
        draft.onlineStaffs = action.staffs;
        break;
      case ADD_ONLINE_STAFF:
        draft.onlineStaffs.push(action.staff);
        break;
      case ADD_CURRENT_STAFF:
        draft.currentStaffs.push(action.staff);
        break;
      case REMOVE_ONLINE_STAFF:
        draft.onlineStaffs = draft.onlineStaffs.filter(staff => staff.id != action.staffId);
        break;
      case REMOVE_CURRENT_STAFF:
        draft.currentStaffs = draft.currentStaffs.filter(staff => staff.id != action.staffId);
        break;
      case DEFAULT_ACTION:
        break;
    }
  });

export default visitorChatReducer;
