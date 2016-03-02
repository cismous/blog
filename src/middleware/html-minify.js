/**
 * Module dependencies.
 */

const minify = require('html-minifier').minify;

export default options => {
  options = options || {};

  return async (ctx, next) => {
    await next();

    if (!ctx.response.is('html')) return;
    let body = ctx.response.body;
    if (!body) return;
    // too lazy to handle streams
    if (typeof body.pipe === 'function') return;
    if (Buffer.isBuffer(body))
      body = body.toString('utf8');
    else if (typeof body === 'object')
      return; // wtf programming
    ctx.response.body = minify(body, options)
  }
}
