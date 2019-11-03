/*
 *
 * StaffMain reducer
 *
 */
import produce from 'immer';
import {
  ADD_ACTIVE_CHAT,
  ADD_MESSAGE_FROM_UNCLAIMED_CHAT,
  ADD_UNCLAIMED_CHAT,
  DEFAULT_ACTION,
  REMOVE_ACTIVE_CHAT,
  REMOVE_UNCLAIMED_CHAT,
  RESET,
  SET_UNCLAIMED_CHATS,
  ADD_MESSAGE_HISTORY,
  LOAD_VOLUNTEERS,
  LOAD_SUPERVISORS,
  SET_HAS_MORE_MESSAGES,
  REMOVE_UNCLAIMED_CHAT_BY_VISITOR_ID,
  ADD_MESSAGE_FROM_ACTIVE_CHAT,
  ADD_MESSAGE_FROM_ACTIVE_CHAT_BY_VISITOR_ID,
  ADD_MESSAGE_FROM_UNCLAIMED_CHAT_BY_VISITOR_ID,
  SHOW_LOADED_MESSAGE_HISTORY,
  REGISTER_STAFF_FAILURE,
  REGISTER_STAFF_SUCCESS,
  REGISTER_STAFF,
  CLEAR_UNREAD_COUNT,
  INCREMENT_UNREAD_COUNT,
} from './constants';

export const initialState = {
  unclaimedChats: [],
  activeChats: [],
  registerStaffClearTrigger: true,
  registerStaffPending: false,
  unreadCount: {},
  allVolunteers: [],
  allSupervisors: [],
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
          chat => chat.room.id != action.room,
        );
        break;
      case REMOVE_UNCLAIMED_CHAT_BY_VISITOR_ID:
        draft.unclaimedChats = draft.activeChats.filter(
          chat => chat.user.id != action.visitorId,
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
        let visitorId = action.visitor.id;
        draft.unclaimedChats
          .filter(chat => chat.user.id == visitorId)
          .forEach(chat =>
            chat.contents.push({
              user: action.visitor,
              content: action.content,
            }),
          );
        break;
      case ADD_MESSAGE_FROM_ACTIVE_CHAT_BY_VISITOR_ID:
        visitorId = action.visitorId;
        draft.activeChats
          .filter(chat => chat.user.id == visitorId)
          .forEach(chat => chat.contents.push(action.data));
        break;
      case ADD_MESSAGE_FROM_UNCLAIMED_CHAT_BY_VISITOR_ID:
        visitorId = action.visitorId;
        draft.unclaimedChats
          .filter(chat => chat.user.id == visitorId)
          .forEach(chat => chat.contents.push(data));
        break;
      case ADD_MESSAGE_FROM_ACTIVE_CHAT:
        draft.activeChats
          .filter(chat => chat.room.id == action.roomId)
          .forEach(chat => chat.contents.push(action.data));
        break;
      case ADD_MESSAGE_HISTORY:
        draft.unclaimedChats
          .filter(chat => chat.user.id == action.visitorId)
          .forEach(chat => {
            chat.loadedHistory = action.messages;
          });
        draft.activeChats
          .filter(chat => chat.user.id == action.visitorId)
          .forEach(chat => {
            chat.loadedHistory = action.messages;
          });
        break;
      case LOAD_VOLUNTEERS:
        draft.allVolunteers = action.volunteers;
        break;
      case LOAD_SUPERVISORS:
        draft.allSupervisors = action.supervisors;
        break;
      case SET_HAS_MORE_MESSAGES: {
        draft.unclaimedChats
          .filter(chat => chat.user.id == action.visitorId)
          .forEach(chat => {
            chat.hasMoreMessages = action.hasMoreMessages;
          });
        draft.activeChats
          .filter(chat => chat.user.id == action.visitorId)
          .forEach(chat => {
            chat.hasMoreMessages = action.hasMoreMessages;
          });
        break;
      }
      case SHOW_LOADED_MESSAGE_HISTORY:
        draft.unclaimedChats
          .filter(chat => chat.user.id == action.visitorId)
          .forEach(chat => {
            chat.contents = chat.loadedHistory.concat(chat.contents);
            chat.loadedHistory = [];
          });
        draft.activeChats
          .filter(chat => chat.user.id == action.visitorId)
          .forEach(chat => {
            chat.contents = chat.loadedHistory.concat(chat.contents);
            chat.loadedHistory = [];
          });
        break;
      case REGISTER_STAFF_FAILURE:
        draft.registerStaffPending = false;
        break;
      case REGISTER_STAFF_SUCCESS:
        draft.registerStaffPending = false;
        draft.registerStaffClearTrigger ^= true;
        break;
      case REGISTER_STAFF:
        draft.registerStaffPending = true;
        break;
      case RESET:
        return initialState;
      case CLEAR_UNREAD_COUNT:
        draft.unreadCount[action.visitorId] = 0;
        break;
      case INCREMENT_UNREAD_COUNT:
        if (!draft.unreadCount[action.visitorId]) {
          draft.unreadCount[action.visitorId] = 0;
        }
        draft.unreadCount[action.visitorId]++;
        break;
    }
  });

export default staffMainReducer;
