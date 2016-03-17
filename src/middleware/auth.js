/**
 * Module dependencies.
 */

const passport = require('koa-passport');

/**
 * Mongodb collection.
 */

import Users from '../model/users';

passport.serializeUser(function (user, done) {
  done(null, user._id)
});

passport.deserializeUser(function (id, done) {
  Users.findById(id, done);
});

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(function (username, password, done) {
  Users.findOne({username: username, password: password}, done);
}));
