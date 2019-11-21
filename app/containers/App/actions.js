/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

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
  LOAD_SETTINGS,
  SET_SETTINGS,
  SUBMIT_SETTINGS,
} from './constants';

/**
 * Load the repositories, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_REPOS
 */
export function loadRepos() {
  return {
    type: LOAD_REPOS,
  };
}

/**
 * Dispatched when the repositories are loaded by the request saga
 *
 * @param  {array} repos The repository data
 * @param  {string} username The current username
 *
 * @return {object}      An action object with a type of LOAD_REPOS_SUCCESS passing the repos
 */
export function reposLoaded(repos, username) {
  return {
    type: LOAD_REPOS_SUCCESS,
    repos,
    username,
  };
}

/**
 * Dispatched when loading the repositories fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_REPOS_ERROR passing the error
 */
export function repoLoadingError(error) {
  return {
    type: LOAD_REPOS_ERROR,
    error,
  };
}

export function userLoggedIn(user) {
  return {
    ...user,
    type: USER_LOGGED_IN,
  };
}

export function userLoggedOut() {
  return {
    type: USER_LOGGED_OUT,
  };
}

export function setError(error) {
  return {
    type: SET_ERROR,
    error,
  };
}

export function setSuccess(msg) {
  return {
    type: SET_SUCCESS,
    msg,
  };
}

export function patchUserInfo(data) {
  return {
    type: PATCH_USER_INFO,
    data,
  };
}

export function addNotification(notification) {
  return {
    type: ADD_NOTIFICATION,
    notification,
  }
}

export function loadSettings() {
  return {
    type: LOAD_SETTINGS
  }
}

export function setSettings(settings) {
  return {
    type: SET_SETTINGS,
    settings,
  }
}

export function submitGlobalSettings(settings) {
  return {
    type: SUBMIT_SETTINGS,
    settings,
  }
}