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

function setupSocketEventListeners() {
    Server.addSocketEventListener('onOpen', 'app', function(connection) {
        Engine.addConnection(connection);
    });

    Server.addSocketEventListener('onClose', 'app', function(connection) {
        Engine.removeConnection(connection);
    });

    Server.addSocketEventListener('onMessage', 'app', function(connection, message) {
        Engine.handleIncomingClientMessage(connection, message)
    });
}

setupSocketEventListeners();
Server.start();
