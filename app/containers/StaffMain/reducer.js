/*
 *
 * StaffMain reducer
 *
 */
import produce from 'immer';
import { ADD_ACTIVE_CHAT, ADD_MESSAGE_FROM_UNCLAIMED_CHAT, ADD_UNCLAIMED_CHAT, DEFAULT_ACTION, REMOVE_ACTIVE_CHAT, REMOVE_UNCLAIMED_CHAT, RESET, SET_UNCLAIMED_CHATS, ADD_MESSAGE_HISTORY, SET_HAS_MORE_MESSAGES, REMOVE_UNCLAIMED_CHAT_BY_VISITOR_ID, ADD_MESSAGE_FROM_ACTIVE_CHAT } from './constants';

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
        draft.unclaimedChats = draft.unclaimedChats.filter(
          chat => chat.room.id != action.room
        );
        break;
      case REMOVE_UNCLAIMED_CHAT_BY_VISITOR_ID:
        draft.unclaimedChats = draft.activeChats.filter(
          chat => chat.user.id != action.visitorId
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
              user: action.visitor,
              content: action.content,
            }),
          );
        break;
      case ADD_MESSAGE_FROM_ACTIVE_CHAT:
        draft.activeChats.filter(chat => chat.room.id == action.roomId)
          .forEach(chat =>
            chat.contents.push(action.data));
        break;
      case ADD_MESSAGE_HISTORY:
        draft.unclaimedChats.filter(chat => chat.user.id == action.visitorId)
          .forEach(chat => {
            chat.contents = action.messages.concat(chat.contents);
          })
        draft.activeChats.filter(chat => chat.user.id == action.visitorId)
          .forEach(chat => {
            chat.contents = action.messages.concat(chat.contents);
          })
        break;
      case RESET:
        draft = initialState;
        break;
    }
  });

export default staffMainReducer;
