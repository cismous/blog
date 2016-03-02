const Router = require("koa-router");

import indexController from '../controllers/admin/index';

module.exports = function (app, config) {
  const router = new Router({
    prefix: '/admin'
  });
  // Require authentication for now
  app.use((ctx, next) => {
    if (ctx.isAuthenticated())
      return next();
    else
      ctx.redirect('/login')
  });
  router
    .get('/', indexController);
  app.use(router.routes());
};
