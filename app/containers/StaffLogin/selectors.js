import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the staffLogin state domain
 */

const selectStaffLoginDomain = state => state.staffLogin || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by StaffLogin
 */

const makeSelectStaffLogin = () =>
  createSelector(
    selectStaffLoginDomain,
    substate => substate,
  );

export default makeSelectStaffLogin;
export { selectStaffLoginDomain };
