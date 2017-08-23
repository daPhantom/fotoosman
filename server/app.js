"use strict";

var Logger = require('shared/logger'),
  Config = require('shared/config'),
  Board = require('./app/board'),
  Server = require('./app/server');

function setupClient() {
  Server.spawnSocketServer('client');

  Server.on('open', 'client', 'app', function(connection) {

  });

  Server.on('close', 'client', 'app', function(connection) {

  });

  Server.on('message', 'client', 'app', function(connection, message) {

  });
}

function setupBoards() {
  Config.get('boards').forEach(function(name) {
    name = 'board-' + name;

    var board = new Board(name);
    Server.spawnSocketServer(name);

    Server.on('open', name, 'app', function(connection) {
      board.addConnection(connection);
    });

    Server.on('close', name, 'app', function(connection) {
      board.removeConnection(connection);
    });

    Server.on('message', name, 'app', function(connection, message) {
      board.onMessage(connection, message)
    });
  });
}

Server.start();
setupClient();
setupBoards();
