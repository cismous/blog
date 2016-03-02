/**
 * Module dependencies.
 */

const SocketIo = require('socket.io');

import articles from './articles';

function onConnection(socket) {
  socket.ip = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;

  onConnect(socket);

  socket.onclose = reason => {
    console.log('on close');
  };

  socket.on('disconnect', data => {
    onDisconnect(socket, data);
  });

  socket.on('*', payload => {
    onMessage(socket, payload);
  });

  socket.on('add user', function (msg) {
    console.log('message: ' + msg);
  });
}

function onConnect(socket) {
  articles(socket);
}

function onDisconnect(socket, data) {
  console.log('on disconnect');
}

function onMessage(socket, payload) {
  console.log('on message');
}

module.exports = server => {
  const io = SocketIo(server);
  io.on('connection', onConnection);
};
