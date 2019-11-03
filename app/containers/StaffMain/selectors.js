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

const makeSelectAllVolunteers = () =>
  createSelector(
    selectStaffMainDomain,
    substate => substate.allVolunteers,
  );

const makeSelectAllSupervisors = () =>
  createSelector(
    selectStaffMainDomain,
    substate => substate.allSupervisors,
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

export default makeSelectStaffMain;
export {
  selectStaffMainDomain,
  makeSelectUnclaimedChats,
  makeSelectAllVolunteers,
  makeSelectAllSupervisors,
  makeSelectActiveChats,
  makeSelectRegisterStaffPending,
  makeSelectRegisterStaffClearTrigger,
  makeSelectUnreadCount,
};
