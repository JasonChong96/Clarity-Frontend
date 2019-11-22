/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectGlobal = state => state.global || initialState;

const selectRouter = state => state.router;

const makeSelectCurrentUser = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.currentUser,
  );

const makeSelectLoading = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.loading,
  );

const makeSelectError = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.error,
  );

const makeSelectNotifications = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.notifications,
  );

const makeSelectNotificationsUnread = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.notificationsUnread,
  );

const makeSelectSuccess = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.success,
  );
const makeSelectRepos = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.userData.repositories,
  );

const makeSelectLocation = () =>
  createSelector(
    selectRouter,
    routerState => routerState.location,
  );

const makeSelectSettings = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.settings,
  );

export {
  selectGlobal,
  makeSelectSettings,
  makeSelectCurrentUser,
  makeSelectLoading,
  makeSelectError,
  makeSelectRepos,
  makeSelectLocation,
  makeSelectSuccess,
  makeSelectNotifications,
  makeSelectNotificationsUnread,
};
