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

export default makeSelectStaffMain;
export { selectStaffMainDomain };
