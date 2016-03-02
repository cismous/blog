/**
 * Module dependencies.
 */

const Router = require("koa-router");
const co = require('co');
const views = require('koa-views');
const convert = require('koa-convert');
const passport = require('koa-passport');

import Articles from '../model/articles';
import indexController from '../controllers/index';
import articleController from '../controllers/article';
import errorController from '../controllers/error'
import loginController from '../controllers/admin/login'
import favicon from '../controllers/favicon'

module.exports = (app, config) => {
  app.use(errorController());
  app.use(favicon(config.app.root + "/public/favicon.ico"));
  app.use(convert(views(config.app.templatePath, {
    map: {
      html: 'nunjucks'
    }
  })));
  app.use(async (ctx, next) => {
    ctx.render = co.wrap(ctx.render);
    await next();
  });

  const router = new Router();

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/'
  }));

  router
    .get('/', indexController)
    .get('/login', loginController)
    .get('/:slug', articleController);

  app.use(router.routes());
};
