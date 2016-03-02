/**
 * Module dependencies.
 */

const convert = require('koa-convert');
const serve = require('koa-static');
const compress = require('koa-compress');

import mini from '../middleware/html-minify';

module.exports = function (app, config) {
  app.use(compress({
    filter: function (content_type) {
      return /text/i.test(content_type)
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
  }));

  app.use(mini({collapseWhitespace: true}));

  // images static
  app.use(convert(serve(config.app.root + "/public/uploads", {maxage: 5184000000})));

  if (config.app.env === 'production')
    app.use(convert(serve(config.app.root + "/build/public", {maxage: 5184000000})));
  else {
    const proxy = convert(require("koa-proxy")({
      host: "http://localhost:4002",
      match: /^\/_assets\//,
    }));
    app.use(proxy);
  }
};
