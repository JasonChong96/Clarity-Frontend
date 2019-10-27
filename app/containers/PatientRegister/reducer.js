/*
 *
 * PatientRegister reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  REGISTER_PATIENT_FAILURE,
  REGISTER_PATIENT_SUCCESS,
} from './constants';

export const initialState = { error: false };

/* eslint-disable default-case, no-param-reassign */
const patientRegisterReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case REGISTER_PATIENT_FAILURE:
        draft.error = action.error;
        break;
      case REGISTER_PATIENT_SUCCESS:
        draft.error = false;
        break;
    }
  });

export default patientRegisterReducer;
