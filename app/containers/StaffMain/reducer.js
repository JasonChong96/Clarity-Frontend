/*
 *
 * StaffMain reducer
 *
 */
import produce from 'immer';
import {
  ADD_ACTIVE_CHAT,
  ADD_UNCLAIMED_CHAT,
  DEFAULT_ACTION,
  REMOVE_ACTIVE_CHAT,
  RESET,
  SET_UNCLAIMED_CHATS,
  ADD_MESSAGE_HISTORY,
  LOAD_VOLUNTEERS,
  LOAD_SUPERVISORS,
  SET_HAS_MORE_MESSAGES,
  REMOVE_UNCLAIMED_CHAT_BY_VISITOR_ID,
  SHOW_LOADED_MESSAGE_HISTORY,
  REGISTER_STAFF_FAILURE,
  REGISTER_STAFF_SUCCESS,
  REGISTER_STAFF,
  CLEAR_UNREAD_COUNT,
  INCREMENT_UNREAD_COUNT,
  SET_ONLINE_USERS,
  REMOVE_ONLINE_USER,
  ADD_ONLINE_USER,
  ADD_TO_ALL_VISITORS,
  SET_MESSAGES_FOR_SUPERVISOR_PANEL,
  ADD_MESSAGES_BEFORE_FOR_SUPERVISOR_PANEL,
  ADD_MESSAGES_AFTER_FOR_SUPERVISOR_PANEL,
  REMOVE_ACTIVE_CHAT_BY_ROOM_ID,
  ADD_VISITORS_TO_BOOKMARKED_CHATS,
  REMOVE_VISITOR_FROM_BOOKMARKED_CHATS,
  SHOW_MESSAGES_BEFORE_FOR_SUPERVISOR_PANEL,
  SHOW_MESSAGES_AFTER_FOR_SUPERVISOR_PANEL,
  ADD_MESSAGE_FOR_SUPERVISOR_PANEL,
  SET_ONLINE_VISITORS,
  REMOVE_ONLINE_VISITOR,
  ADD_ONLINE_VISITOR,
  SET_VISITOR_TALKING_TO,
  SET_UNREAD_CHATS,
  SET_FLAGGED_CHATS,
  REMOVE_FLAGGED_CHAT,
  ADD_FLAGGED_CHAT,
  CHANGE_CHAT_PRIORITY,
  ADD_MESSAGE_FOR_STAFF_PANEL,
  SET_MESSAGES_FOR_STAFF_PANEL,
  SET_HISTORY_FOR_STAFF_PANEL,
  SHOW_HISTORY_FOR_STAFF_PANEL,
  SET_OFFLINE_UNCLAIMED_CHATS,
  ADD_OFFLINE_UNCLAIMED_CHAT,
  REMOVE_OFFLINE_UNCLAIMED_CHAT,
} from './constants';

export const initialState = {
  unclaimedChats: [],
  activeChats: [],
  registerStaffClearTrigger: true,
  registerStaffPending: false,
  unreadCount: {},
  allVolunteers: [],
  allSupervisors: [],
  onlineUsers: [],
  onlineVisitors: [],
  unreadChats: [],
  ongoingChats: [],
  allChats: [],
  flaggedChats: [],
  bookmarkedChats: [],
  supervisorPanelChats: {},
  staffPanelChats: {},
  offlineUnclaimedChats: [],
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
      case REMOVE_UNCLAIMED_CHAT_BY_VISITOR_ID:
        draft.unclaimedChats = draft.activeChats.filter(
          chat => chat.visitor.id != action.visitorId,
        );
        break;
      case ADD_ACTIVE_CHAT:
        draft.activeChats.push(action.chat);
        break;
      case REMOVE_ACTIVE_CHAT:
        draft.activeChats = draft.activeChats.filter(
          chat => chat.visitor.id != action.visitor.id,
        );
        break;
      case REMOVE_ACTIVE_CHAT_BY_ROOM_ID:
        draft.activeChats = draft.activeChats.filter(
          chat => chat.room.id != action.room,
        );
        break;
      case ADD_MESSAGE_HISTORY:
        draft.unclaimedChats
          .filter(chat => chat.visitor.id == action.visitorId)
          .forEach(chat => {
            chat.loadedHistory = action.messages;
          });
        draft.activeChats
          .filter(chat => chat.visitor.id == action.visitorId)
          .forEach(chat => {
            chat.loadedHistory = action.messages;
          });
        draft.flaggedChats
          .filter(chat => chat.visitor.id == action.visitorId)
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
          .filter(chat => chat.visitor.id == action.visitorId)
          .forEach(chat => {
            chat.hasMoreMessages = action.hasMoreMessages;
          });
        draft.activeChats
          .filter(chat => chat.visitor.id == action.visitorId)
          .forEach(chat => {
            chat.hasMoreMessages = action.hasMoreMessages;
          });
        draft.flaggedChats
          .filter(chat => chat.visitor.id == action.visitorId)
          .forEach(chat => {
            chat.hasMoreMessages = action.hasMoreMessages;
          });
        break;
      }
      case SHOW_LOADED_MESSAGE_HISTORY:
        draft.unclaimedChats
          .filter(chat => chat.visitor.id == action.visitorId)
          .forEach(chat => {
            chat.contents = chat.loadedHistory.concat(chat.contents);
            chat.loadedHistory = [];
          });
        draft.activeChats
          .filter(chat => chat.visitor.id == action.visitorId)
          .forEach(chat => {
            chat.contents = chat.loadedHistory.concat(chat.contents);
            chat.loadedHistory = [];
          });
        draft.flaggedChats
          .filter(chat => chat.visitor.id == action.visitorId)
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
      case ADD_ONLINE_USER:
        draft.onlineUsers.push(action.user)
        break;
      case REMOVE_ONLINE_USER:
        draft.onlineUsers = draft.onlineUsers.filter(user => user.id != action.id)
        break;
      case SET_ONLINE_USERS:
        draft.onlineUsers = action.users;
        break;
      case ADD_ONLINE_VISITOR:
        if (draft.onlineVisitors.findIndex(visitor => visitor.id == action.visitor.id) == -1) {
          draft.onlineVisitors.push(action.visitor)
        }
        break;
      case REMOVE_ONLINE_VISITOR:
        draft.onlineVisitors = draft.onlineVisitors.filter(user => user.id != action.visitorId)
        break;
      case SET_ONLINE_VISITORS:
        draft.onlineVisitors = action.visitors;
        break;
      case ADD_TO_ALL_VISITORS:
        if (action.visitors.length && (!draft.allChats.length || draft.allChats.slice(-1)[0] != action.visitors.slice(-1)[0])) {
          draft.allChats = draft.allChats.concat(action.visitors);
        }
        break;
      case ADD_VISITORS_TO_BOOKMARKED_CHATS:
        if (action.visitors.length && (!draft.bookmarkedChats.length || draft.bookmarkedChats.slice(-1)[0] != action.visitors.slice(-1)[0])) {
          draft.bookmarkedChats = draft.bookmarkedChats.concat(action.visitors);
        }
        break;
      case REMOVE_VISITOR_FROM_BOOKMARKED_CHATS:
        draft.bookmarkedChats = draft.bookmarkedChats.filter(visitor => visitor.id != action.visitorId);
        break;
      case SET_MESSAGES_FOR_SUPERVISOR_PANEL:
        draft.supervisorPanelChats[action.visitorId] = {
          contents: action.contents,
        }
        break;
      case SHOW_MESSAGES_BEFORE_FOR_SUPERVISOR_PANEL:
        if (draft.supervisorPanelChats[action.visitorId].prev) {
          draft.supervisorPanelChats[action.visitorId].contents = draft.supervisorPanelChats[action.visitorId].prev.concat(draft.supervisorPanelChats[action.visitorId].contents);
          draft.supervisorPanelChats[action.visitorId].prev = false;
        }
        break;
      case SHOW_MESSAGES_AFTER_FOR_SUPERVISOR_PANEL:
        if (draft.supervisorPanelChats[action.visitorId].next) {
          draft.supervisorPanelChats[action.visitorId].contents = draft.supervisorPanelChats[action.visitorId].contents.concat(draft.supervisorPanelChats[action.visitorId].next);
          draft.supervisorPanelChats[action.visitorId].next = false
        }
        break;
      case ADD_MESSAGES_AFTER_FOR_SUPERVISOR_PANEL:
        draft.supervisorPanelChats[action.visitorId].next = action.contents;
        break;
      case ADD_MESSAGES_BEFORE_FOR_SUPERVISOR_PANEL:
        draft.supervisorPanelChats[action.visitorId].prev = action.contents;
        break;
      case ADD_MESSAGE_FOR_SUPERVISOR_PANEL:
        if (draft.supervisorPanelChats[action.visitorId] && !draft.supervisorPanelChats[action.visitorId].next) {
          draft.supervisorPanelChats[action.visitorId].contents.push(action.content);
        }
        draft.flaggedChats.filter(chat => chat.user.id == action.visitorId)
          .forEach(chat => chat.contents.push(action.content));
        break;
      case SET_VISITOR_TALKING_TO:
        draft.onlineVisitors.filter(visitor => visitor.id == action.visitorId)
          .forEach(visitor => {
            visitor.staff = action.user;
          })
        break;
      case SET_UNREAD_CHATS:
        draft.unreadChats = action.visitors;
        break;
      case SET_FLAGGED_CHATS:
        draft.flaggedChats = action.chats;
        break;
      case ADD_FLAGGED_CHAT:
        draft.flaggedChats.push(action.chat);
        break;
      case REMOVE_FLAGGED_CHAT:
        draft.flaggedChats = draft.flaggedChats.filter(chat => chat.visitor.id != action.visitorId);
        break;
      case CHANGE_CHAT_PRIORITY:
        draft.unclaimedChats
          .filter(chat => chat.visitor.id == action.visitorId)
          .forEach(chat => {
            chat.visitor.severity_level = action.priority
          });
        draft.activeChats
          .filter(chat => chat.visitor.id == action.visitorId)
          .forEach(chat => {
            chat.visitor.severity_level = action.priority
          });
        if (action.priority == 0) {
          draft.flaggedChats = draft.flaggedChats
            .filter(chat => chat.visitor.id != action.visitorId)
        } else {
          draft.flaggedChats
            .filter(chat => chat.visitor.id == action.visitorId)
            .forEach(chat => {
              chat.visitor.severity_level = action.priority
            });
        }
        break;
      case ADD_MESSAGE_FOR_STAFF_PANEL:
        if (draft.staffPanelChats[action.visitorId]) {
          draft.staffPanelChats[action.visitorId].contents.push(action.content);
        }
        break;
      case SET_MESSAGES_FOR_STAFF_PANEL:
        draft.staffPanelChats[action.visitorId] = {
          contents: action.contents,
        }
        break;
      case SET_HISTORY_FOR_STAFF_PANEL:
        draft.staffPanelChats[action.visitorId].loadedHistory = action.history;
        break;
      case SHOW_HISTORY_FOR_STAFF_PANEL:
        draft.staffPanelChats[action.visitorId].contents = draft.staffPanelChats[action.visitorId].loadedHistory.concat(draft.staffPanelChats[action.visitorId].contents);
        draft.staffPanelChats[action.visitorId].loadedHistory = false;
        break;
      case SET_OFFLINE_UNCLAIMED_CHATS:
        draft.offlineUnclaimedChats = action.chats;
        break;
      case ADD_OFFLINE_UNCLAIMED_CHAT:
        draft.offlineUnclaimedChats.push(action.chat);
        break;
      case REMOVE_OFFLINE_UNCLAIMED_CHAT:
        draft.offlineUnclaimedChats = draft.offlineUnclaimedChats.filter(chat => chat.visitor.id != action.visitorId);
        break;
    }
  });

export default staffMainReducer;
