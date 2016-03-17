const Router = require("koa-router");

import indexController from '../controllers/admin/index';

module.exports = function (app, config) {
  const router = new Router({
    prefix: '/admin'
  });
  // Require authentication for now
  app.use((ctx, next) => {
    if (ctx.request.path.indexOf('/admin') !== -1 && !ctx.isAuthenticated())
      ctx.redirect('/login');
    else
      return next();
  });
  router
    .get('/', indexController);
  app.use(router.routes());
};
