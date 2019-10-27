/*
 *
 * VisitorChat reducer
 *
 */
import produce from 'immer';
import { ADD_CHAT_MESSAGE, DEFAULT_ACTION, SET_FIRST_MSG, SET_STAFF_JOINED } from './constants';

export const initialState = {
  messages: [],
  firstMsg: true,
  staffJoined: false,
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
      case DEFAULT_ACTION:
        break;
    }
  });

export default visitorChatReducer;
