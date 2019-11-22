/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import {
  LOAD_REPOS,
  LOAD_REPOS_ERROR,
  LOAD_REPOS_SUCCESS,
  SET_ERROR,
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  SET_SUCCESS,
  PATCH_USER_INFO,
  ADD_NOTIFICATION,
  SET_SETTINGS,
  ADD_NOTIFICATION_UNREAD,
  UPDATE_NOTIFICATION_UNREAD,
} from './constants';

// The initial state of the App
export const initialState = {
  loading: false,
  error: false,
  currentUser: false,
  userData: {
    repositories: false,
  },
  success: false,
  notifications: [],
  notificationsUnread: 0,
  settings: false,
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_REPOS:
        draft.loading = true;
        draft.error = false;
        draft.userData.repositories = false;
        break;

      case LOAD_REPOS_SUCCESS:
        draft.userData.repositories = action.repos;
        draft.loading = false;
        draft.currentUser = action.username;
        break;

      case LOAD_REPOS_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case SET_ERROR:
        draft.error = action.error;
        break;

      case USER_LOGGED_IN:
        const user = { ...action };
        delete user.type;
        draft.currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
        break;

      case USER_LOGGED_OUT:
        draft.currentUser = false;
        localStorage.removeItem('user');
        break;
      case SET_SUCCESS:
        draft.success = action.msg;
        break;
      case PATCH_USER_INFO:
        draft.currentUser.user = action.data;
        break;
      case ADD_NOTIFICATION:
        if (!draft.notifications) {
          draft.notifications = [];
        }
        draft.notifications = action.notification;
        break;
      case ADD_NOTIFICATION_UNREAD:
        if (!draft.notificationsUnread) {
          draft.notificationsUnread = 0;
        }
        draft.notificationsUnread = action.notificationsUnread;
        break;
      case UPDATE_NOTIFICATION_UNREAD:
        draft.notificationsUnread = 0;
        break;
      case SET_SETTINGS:
        draft.settings = action.settings;
        break;
    }
  });

export default appReducer;
