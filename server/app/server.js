"use strict";

var Config = require('./config'),
    Utils = require('./utils'),
    HTTP = require('http'),
    URL = require('url'),
    SockJS = require('sockjs');

function Server() {
    this.httpServers = [];
    this.socketServers = [];

    //Events
    this.onOpen = {};
    this.onMessage = {};
    this.onClose = {};
}

Server.prototype = {
    start: function() {
        this.initHTTPServers();
        this.attachSocketServers();

        Utils.logger().info('Server successfully initialized.')
    },

    initHTTPServers: function() {
        var server = this;

        Config.get('ports').forEach(function(port) {
            var httpServer = HTTP.createServer(server.bindHttpListeners);

            httpServer.listen(port, '0.0.0.0');
            server.httpServers.push(httpServer);

            Utils.logger().info('HTTP server running on ' + port + '.');
        });
    },

    bindHttpListeners: function(request, response) {
        response.writeHead(200, {
            'Content-type': 'text/plain',
            'Access-Control-Allow-Origin': '*'
        });

        try {
            var uri = URL.parse(request.url).pathname;
        } catch (e) {
            response.write('ERROR!');
        }

        //TODO use me later
        response.write("¯\\_(ツ)_/¯");

        response.end();
    },

    attachSocketServers: function() {
        var server = this;

        server.httpServers.forEach(function(httpServer) {
            var socketServer = SockJS.createServer();
            socketServer.installHandlers(httpServer, {
                prefix: '/client'
            });

            socketServer.on('connection', function(connection) {
                for (var key in server.onOpen) {
                    server.onOpen[key](connection);
                }

                connection.on('close', function() {
                    for (var key in server.onClose) {
                        server.onClose[key](connection);
                    }
                });

                connection.on('data', function(message) {
                    try {
                        var message = JSON.parse(message);
                    } catch (error) {
                        Utils.logger().error(error.message);
                        return;
                    }

                    for (var key in server.onMessage) {
                        server.onMessage[key](connection, message);
                    }
                });
            });

            server.socketServers.push(socketServer);
        });
    },

    addSocketEventListener: function(event, key, callback) {
        switch (event) {
            case 'onOpen':
            case 'onopen':
                this.onOpen[key] = callback;
                break;
            case 'onClose':
            case 'onclose':
                this.onClose[key] = callback;
                break;
            case 'onMessage':
            case 'onmessage':
                this.onMessage[key] = callback;
                break;
            default:
                console.log('Trying to register a callback on a non existing event');
                break;
        }
    },

    removeSocketEventListener: function(event, key) {
        switch (event) {
            case 'onOpen':
            case 'onopen':
                delete this.onOpen[key];
                break;
            case 'onClose':
            case 'onclose':
                delete this.onClose[key];
                break;
            case 'onMessage':
            case 'onmessage':
                delete this.onMessage[key];
                break;
            default:
                console.log('Trying to remove a callback on a non existing event');
                break;
        }
    }
};

module.exports = new Server();
