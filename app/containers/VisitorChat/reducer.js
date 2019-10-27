/*
 *
 * VisitorChat reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, ADD_CHAT_MESSAGE } from './constants';

export const initialState = {
  messages: [],
};

/* eslint-disable default-case, no-param-reassign */
const visitorChatReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case ADD_CHAT_MESSAGE:
        draft.messages.push(action.message);
        break;
      case DEFAULT_ACTION:
        break;
    }
  });

export default visitorChatReducer;
