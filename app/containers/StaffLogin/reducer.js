/*
 *
 * StaffLogin reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, VOLUNTEER_LOGIN_FAILURE, VOLUNTEER_LOGIN_SUCCESS } from './constants';

export const initialState = { error: false };

/* eslint-disable default-case, no-param-reassign */
const staffLoginReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case VOLUNTEER_LOGIN_FAILURE:
        draft.error = action.error;
        break;
      case VOLUNTEER_LOGIN_SUCCESS:
        draft.error = false;
        break;
      case DEFAULT_ACTION:
        break;
    }
  });

export default staffLoginReducer;
