/**
 * Module dependencies.
 */

const passport = require('koa-passport');

/**
 * Mongodb collection.
 */

import Users from '../model/users';

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  Users.findOne({username: username}, function (err, user) {
    done(err, user);
  });
});

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(function (username, password, done) {
  // retrieve user ...
  Users.findOne({username: username}, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false);
    if (password === user.password) return done(null, user);
    done(null, false);
  });
}));
