/*
 *
 * VisitorChat actions
 *
 */

import { DEFAULT_ACTION, ADD_CHAT_MESSAGE } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function addChatMessage(message) {
  return {
    type: ADD_CHAT_MESSAGE,
    message,
  };
}
