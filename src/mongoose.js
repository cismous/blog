/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

/**
 * @param {Object} config
 * @api private
 */
const connect = config => {
  mongoose.connect(config.app.database);
};

export {connect}
