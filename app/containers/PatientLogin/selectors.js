import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the patientLogin state domain
 */

const selectPatientLoginDomain = state => state.patientLogin || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by PatientLogin
 */

const makeSelectPatientLogin = () =>
  createSelector(
    selectPatientLoginDomain,
    substate => substate,
  );

export default makeSelectPatientLogin;
export { selectPatientLoginDomain };
