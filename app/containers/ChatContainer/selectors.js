import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the chatContainer state domain
 */

const selectChatContainerDomain = state => state.chatContainer || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ChatContainer
 */

const makeSelectChatContainer = () =>
  createSelector(
    selectChatContainerDomain,
    substate => substate,
  );

export default makeSelectChatContainer;
export { selectChatContainerDomain };
