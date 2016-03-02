/**
 * Module dependencies.
 */

const resolve = require('path').resolve;
const fs = require('mz/fs');

/**
 * Serve favicon.ico
 *
 * @param {String} path
 * @param {Object} [options]
 * @return {Function}
 * @api public
 */

export default (path, options) => {
  let icon;

  if (path) path = resolve(path);
  options = options || {};

  const maxAge = options.maxAge == null
    ? 86400000
    : Math.min(Math.max(0, options.maxAge), 31556926000);

  return async (ctx, next) => {
    if ('/favicon.ico' !== ctx.path) return await next();

    if (!path) return;

    if ('GET' !== ctx.method && 'HEAD' !== ctx.method) {
      ctx.status = 'OPTIONS' == ctx.method ? 200 : 405;
      ctx.set('Allow', 'GET, HEAD, OPTIONS');
      return;
    }

    if (!icon) icon = await fs.readFile(path);

    ctx.set('Cache-Control', 'public, max-age=' + (maxAge / 1000 | 0));
    ctx.type = 'image/x-icon';
    ctx.body = icon;
  };
};
