/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const LOAD_REPOS = 'boilerplate/App/LOAD_REPOS';
export const LOAD_REPOS_SUCCESS = 'boilerplate/App/LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_ERROR = 'boilerplate/App/LOAD_REPOS_ERROR';
export const USER_LOGGED_IN = 'boilerplate/App/USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'boilerplate/App/USER_LOGGED_OUT';
export const SET_ERROR = 'boilerplate/App/SET_ERROR';
export const SET_SUCCESS = 'boilerplate/App/SET_SUCCESS';
export const PATCH_USER_INFO = 'boilerplate/App/PATCH_USER_INFO';
export const ADD_NOTIFICATION = 'boilerplate/App/ADD_NOTIFICATION';
export const LOAD_NOTIFICATION = 'boilerplate/App/LOAD_NOTIFICATION';
export const ADD_NOTIFICATION_UNREAD = 'boilerplate/App/ADD_NOTIFICATION_UNREAD';
export const UPDATE_NOTIFICATION_UNREAD = 'boilerplate/App/UPDATE_NOTIFICATION_UNREAD';
export const LOAD_SETTINGS = 'boilerplate/App/LOAD_SETTINGS';
export const SET_SETTINGS = 'boilerplate/App/SET_SETTINGS';
export const SUBMIT_SETTINGS = 'boilerplate/App/SUBMIT_SETTINGS';