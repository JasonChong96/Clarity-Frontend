import { createBrowserHistory } from 'history';
const history = createBrowserHistory({
  hashType: 'slash',
  getUserConfirmation: (message, callback) => callback(window.confirm(message)),
});
export default history;
