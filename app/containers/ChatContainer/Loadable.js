/**
 *
 * Asynchronously loads the component for ChatContainer
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
