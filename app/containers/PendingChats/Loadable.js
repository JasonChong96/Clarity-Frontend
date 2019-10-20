/**
 *
 * Asynchronously loads the component for PendingChats
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
