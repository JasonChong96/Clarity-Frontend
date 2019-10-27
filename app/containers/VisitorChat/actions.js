/*
 *
 * VisitorChat actions
 *
 */

import { ADD_CHAT_MESSAGE, DEFAULT_ACTION } from './constants';

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
