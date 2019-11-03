import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the staffMain state domain
 */

const selectStaffMainDomain = state => state.staffMain || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by StaffMain
 */

const makeSelectStaffMain = () =>
  createSelector(
    selectStaffMainDomain,
    substate => substate,
  );

const makeSelectUnclaimedChats = () =>
  createSelector(
    selectStaffMainDomain,
    substate => substate.unclaimedChats,
  );

const makeSelectActiveChats = () =>
  createSelector(
    selectStaffMainDomain,
    substate => substate.activeChats,
  );

const makeSelectRegisterStaffClearTrigger = () =>
  createSelector(
    selectStaffMainDomain,
    substate => substate.registerStaffClearTrigger,
  );

const makeSelectRegisterStaffPending = () =>
  createSelector(
    selectStaffMainDomain,
    substate => substate.registerStaffPending,
  );

const makeSelectUnreadCount = () =>
  createSelector(
    selectStaffMainDomain,
    substate => substate.unreadCount,
  );

const makeSelectAllVisitors = () =>
  createSelector(
    selectStaffMainDomain,
    substate => substate.allChats,
  );

const makeSelectOngoingChats = () =>
  createSelector(
    selectStaffMainDomain,
    substate => substate.ongoingChats,
  );

const makeSelectUnreadChats = () =>
  createSelector(
    selectStaffMainDomain,
    substate => substate.unreadChats,
  )

const makeSelectBookmarkedChats = () =>
  createSelector(
    selectStaffMainDomain,
    substate => substate.bookmarkedChats,
  )

const makeSelectSupervisorPanelChats = () =>
  createSelector(
    selectStaffMainDomain,
    substate => substate.supervisorPanelChats,
  )

export default makeSelectStaffMain;
export {
  selectStaffMainDomain,
  makeSelectUnclaimedChats,
  makeSelectActiveChats,
  makeSelectRegisterStaffPending,
  makeSelectRegisterStaffClearTrigger,
  makeSelectUnreadCount,
  makeSelectAllVisitors,
  makeSelectOngoingChats,
  makeSelectUnreadChats,
  makeSelectBookmarkedChats,
  makeSelectSupervisorPanelChats,
};
