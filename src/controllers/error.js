/**
 * Module dependencies.
 */

const http = require('http');

/**
 * Error handle.
 *
 *  - `template` defaults to ./error.html
 *
 * @param {Object} opts
 * @return {Function}
 * @api public
 */

export default opts => {
  opts = opts || {};

  // env
  const env = process.env.NODE_ENV || 'development';

  return async (ctx, next) => {
    try {
      await next();
      if (404 === ctx.response.status && !ctx.response.body)
        ctx.throw(404);
    } catch (err) {
      // accepted types
      switch (ctx.accepts('html', 'text', 'json')) {
        case 'text':
          ctx.type = 'text/plain';
          if ('development' === env)
            ctx.body = err.message;
          else if (err.expose)
            ctx.body = err.message;
          else
            throw err;
          break;

        case 'json':
          ctx.type = 'application/json';
          if ('development' === env)
            ctx.body = {error: err.message};
          else if (err.expose)
            ctx.body = {error: err.message};
          else
            ctx.body = {error: http.STATUS_CODES[err.status || 500]};
          break;

        case 'html':
          ctx.type = 'text/html';
          await ctx.render('./error', {
            env: env,
            ctx: ctx,
            request: ctx.request,
            response: ctx.response,
            status: ctx.response.status || 500,
            error: err.message,
            stack: err.stack,
            code: err.code
          });
          break;
      }
    }
  };
};
