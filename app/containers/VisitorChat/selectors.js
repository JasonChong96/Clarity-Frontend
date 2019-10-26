import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the visitorChat state domain
 */

const selectVisitorChatDomain = state => state.visitorChat || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by VisitorChat
 */

const makeSelectVisitorChat = () =>
  createSelector(
    selectVisitorChatDomain,
    substate => substate,
  );

export default makeSelectVisitorChat;
export { selectVisitorChatDomain };
