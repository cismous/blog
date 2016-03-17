/**
 * Module dependencies.
 */

const Router = require("koa-router");
const convert = require('koa-convert');
const passport = require('koa-passport');
const session = require('koa-generic-session');
const MongoStore = require('koa-generic-session-mongo');
const bodyParser = require('koa-bodyparser');

module.exports = (app, config) => {
  app.proxy = true;

  // sessions
  app.keys = [config.app.sessionSecret];
  app.use(convert(session({
    store: new MongoStore({
      url: config.app.database
    })
  })));

  // body parser
  app.use(bodyParser());

  // authentication
  require('../middleware/auth');
  app.use(passport.initialize());
  app.use(passport.session());

  const router = new Router();
  router.post('login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/404'
  }));
  router.get('/logout', ctx => {
    ctx.logout();
    ctx.redirect('/')
  });
  app.use(router.routes());
};
