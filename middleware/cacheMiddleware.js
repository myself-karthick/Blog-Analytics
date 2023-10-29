import memoize from 'lodash';

const cacheDuration = 60000;
const memoizedHandler = (handler) => memoize(handler, undefined, cacheDuration);

export { memoizedHandler };