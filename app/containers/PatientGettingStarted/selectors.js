import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the patientGettingStarted state domain
 */

const selectPatientGettingStartedDomain = state =>
  state.patientGettingStarted || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by PatientGettingStarted
 */

const makeSelectPatientGettingStarted = () =>
  createSelector(
    selectPatientGettingStartedDomain,
    substate => substate,
  );

export default makeSelectPatientGettingStarted;
export { selectPatientGettingStartedDomain };

