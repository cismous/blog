/**
 * Module dependencies.
 */

const SocketIo = require('socket.io');

import articles from './articles';

function onConnection(socket) {
  socket.ip = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;

  onConnect(socket);
}

function onConnect(socket) {
  articles(socket);
}

module.exports = server => {
  const io = SocketIo(server);
  io.on('connection', onConnection);
};
