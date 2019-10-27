/*
 *
 * StaffMain reducer
 *
 */
import produce from 'immer';
import { ADD_ACTIVE_CHAT, ADD_MESSAGE_FROM_UNCLAIMED_CHAT, ADD_UNCLAIMED_CHAT, DEFAULT_ACTION, REMOVE_ACTIVE_CHAT, REMOVE_UNCLAIMED_CHAT, RESET, SET_UNCLAIMED_CHATS } from './constants';

export const initialState = {
  unclaimedChats: [],
  activeChats: [],
};

/* eslint-disable default-case, no-param-reassign */
const staffMainReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case SET_UNCLAIMED_CHATS:
        draft.unclaimedChats = action.unclaimedChats;
        break;
      case ADD_UNCLAIMED_CHAT:
        draft.unclaimedChats.push(action.room);
        break;
      case REMOVE_UNCLAIMED_CHAT:
        draft.unclaimedChats = draft.activeChats.filter(
          chat => chat.room.id != action.room,
        );
        break;
      case ADD_ACTIVE_CHAT:
        draft.activeChats.push(action.chat);
        break;
      case REMOVE_ACTIVE_CHAT:
        draft.activeChats = draft.activeChats.filter(
          chat => chat.user.id != action.visitor.id,
        );
        break;
      case ADD_MESSAGE_FROM_UNCLAIMED_CHAT:
        const visitorId = action.visitor.id;
        draft.unclaimedChats
          .filter(chat => chat.user.id == visitorId)
          .forEach(chat =>
            chat.contents.push({
              from: action.visitor,
              content: action.content,
            }),
          );
        break;
      case RESET:
        draft = initialState;
        break;
    }
  });

export default staffMainReducer;
