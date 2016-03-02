// set babel in entry file
require("babel-core/register")();

/**
 * Dependencies
 */

const Koa = require('koa');
const app = new Koa();

const config = require('./src/config/config');

require('./src/mongoose').connect(config);
require("./src/config/auth")(app, config);
require("./src/config/koa")(app, config);
require("./src/routes/routes")(app, config);
require("./src/routes/admin")(app, config);

if (!module.parent) {
  const server = require('http').createServer(app.callback());
  require("./src/socket.io/index")(server);
  server.listen(config.app.port);
  console.log('Server listening on', config.app.port);
}

