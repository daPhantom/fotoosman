"use strict";

var Config = require('./config'),
    Utils = require('./utils'),
    argv = require('minimist')(process.argv.slice(2)),
    Board = require('./board'),
    Server = require('./server');

if (typeof argv.logLevel !== 'undefined') {
    //set log level to the one which was set via args
    Utils.logger().setLevel(argv.logLevel);
} else {
    //set production log level to 4
    Utils.logger().setLevel(4);
}

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

        Server.on('open', 'board-random', 'app', function(connection) {
            board.addConnection(connection);
        });

        Server.on('close', 'board-random', 'app', function(connection) {
            board.removeConnection(connection);
        });

        Server.on('message', 'board-random', 'app', function(connection, message) {
            board.handleIncomingClientMessage(connection, message)
        });
    });
}

Server.start();
setupClient();
setupBoards();
