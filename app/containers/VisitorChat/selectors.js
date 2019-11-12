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

const makeSelectChatMessages = () =>
  createSelector(
    selectVisitorChatDomain,
    substate => substate.messages,
  );

const makeSelectChatLoadedHistory = () =>
  createSelector(
    selectVisitorChatDomain,
    substate => substate.loadedHistory,
  );


const makeSelectFirstMsg = () =>
  createSelector(
    selectVisitorChatDomain,
    substate => substate.firstMsg,
  );

const makeSelectStaffJoined = () =>
  createSelector(
    selectVisitorChatDomain,
    substate => substate.staffJoined,
  );

const makeSelectStaffTypingTime = () =>
  createSelector(
    selectVisitorChatDomain,
    substate => substate.staffTypingTime,
  );

export default makeSelectVisitorChat;
export {
  selectVisitorChatDomain,
  makeSelectStaffTypingTime,
  makeSelectChatMessages,
  makeSelectChatLoadedHistory,
  makeSelectStaffJoined,
  makeSelectFirstMsg,
};
