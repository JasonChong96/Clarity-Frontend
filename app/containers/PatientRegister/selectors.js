import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the patientRegister state domain
 */

const selectPatientRegisterDomain = state =>
  state.patientRegister || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by PatientRegister
 */

const makeSelectPatientRegister = () =>
  createSelector(
    selectPatientRegisterDomain,
    substate => substate,
  );

const makeSelectError = () =>
  createSelector(
    selectPatientRegisterDomain,
    substate => substate.error,
  );

export default makeSelectPatientRegister;
export { selectPatientRegisterDomain, makeSelectError };
