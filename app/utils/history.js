import { createHashHistory } from 'history';
const history = createHashHistory({
  hashType: 'slash',
  getUserConfirmation: (message, callback) => callback(window.confirm(message)),
});
export default history;
