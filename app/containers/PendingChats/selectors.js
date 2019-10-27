import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the pendingChats state domain
 */

const selectPendingChatsDomain = state => state.pendingChats || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by PendingChats
 */

const makeSelectPendingChats = () =>
  createSelector(
    selectPendingChatsDomain,
    substate => substate,
  );

export default makeSelectPendingChats;
export { selectPendingChatsDomain };
