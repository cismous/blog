require("babel-core/register")();

const config = require('./webpack/webpack.config');
module.exports = config.default();
