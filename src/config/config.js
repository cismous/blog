/**
 * Module dependencies.
 */

const path = require('path');
const _ = require("lodash");

const env = process.env.NODE_ENV = process.env.NODE_ENV || "development";
const root = path.normalize(path.join(__dirname, "/../.."));

const base = {
  app: {
    root: path.normalize(path.join(__dirname, "/../..")),
    templatePath: root + '/assets/templates',
    env: env,
  }
};

const specific = {
  development: {
    app: {
      port: 4000,
      name: "Website",
      database: 'mongodb://blog:PODrWYUMOTokDcm2yoII@yufeg.com/blog',
      sessionSecret: 'test',
      keys: ["test"],
    }
  },
  test: {
    app: {
      port: 4001,
      name: "Website Mocha - Test realm",
      keys: ["test"],
    }
  },
  production: {
    app: {
      cdn: "https://o373t90m2.qnssl.com/",
      port: process.env.PORT || 4000,
      name: "yufeng-blog",
      database: 'mongodb://blog:PODrWYUMOTokDcm2yoII@yufeg.com/blog',
      sessionSecret: 'test',
      keys: ["test"],
    }
  }
};

module.exports = _.merge(base, specific[env]);
