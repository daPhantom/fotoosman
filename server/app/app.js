"use strict";

var Utils = require('./utils'),
    argv = require('minimist')(process.argv.slice(2)),
    Engine = require('./engine'),
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
    var boardEngine = new Engine('board-random');
    Server.spawnSocketServer('board-random');

    Server.on('open', 'board-random', 'app', function(connection) {
        boardEngine.addConnection(connection);
    });

    Server.on('close', 'board-random', 'app', function(connection) {
        boardEngine.removeConnection(connection);
    });

    Server.on('message', 'board-random', 'app', function(connection, message) {
        boardEngine.handleIncomingClientMessage(connection, message)
    });

    var musicEngine = new Engine('board-music');
    Server.spawnSocketServer('board-music');

    Server.on('open', 'board-music', 'app', function(connection) {
        musicEngine.addConnection(connection);
    });

    Server.on('close', 'board-music', 'app', function(connection) {
        musicEngine.removeConnection(connection);
    });

    Server.on('message', 'board-music', 'app', function(connection, message) {
        musicEngine.handleIncomingClientMessage(connection, message)
    });
}

Server.start();
setupClient();
setupBoards();
