"use strict";

var Config = require('shared/config'),
    Logger = require('shared/logger'),
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
    },

    initHTTPServers: function() {
        var server = this;

        Config.get('ports').forEach(function(port) {
            var httpServer = HTTP.createServer(server.bindHttpListeners);

            httpServer.listen(port, '0.0.0.0');
            server.httpServers.push(httpServer);

            Logger.info('HTTP server running on ' + port + '.');
        });
    },

    bindHttpListeners: function(request, response) {
        response.writeHead(200, {
            'Content-type': 'text/html; charset=utf-8',
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

    spawnSocketServer: function(name) {
        var server = this;

        server.httpServers.forEach(function(httpServer) {
            var socketServer = SockJS.createServer();
            socketServer.installHandlers(httpServer, {
                prefix: '/' + name
            });

            server.onOpen[name] = {};
            server.onClose[name] = {};
            server.onMessage[name] = {};

            socketServer.on('connection', function(connection) {
                for (var key in server.onOpen[name]) {
                    server.onOpen[name][key](connection);
                }

                connection.on('close', function() {
                    for (var key in server.onClose[name]) {
                        server.onClose[name][key](connection);
                    }
                });

                connection.on('data', function(message) {
                    try {
                        var message = JSON.parse(message);
                    } catch (error) {
                        Logger.error(error.message);
                        return;
                    }

                    for (var key in server.onMessage[name]) {
                        server.onMessage[name][key](connection, message);
                    }
                });
            });

            server.socketServers.push(socketServer);
        });
    },

    on: function(event, name, key, callback) {
        switch (event) {
            case 'open':
            case 'onOpen':
            case 'onopen':
                this.onOpen[name][key] = callback;
                break;
            case 'close':
            case 'onClose':
            case 'onclose':
                this.onClose[name][key] = callback;
                break;
            case 'message':
            case 'onMessage':
            case 'onmessage':
                this.onMessage[name][key] = callback;
                break;
            default:
                console.log('Trying to register a callback on a non existing event');
                break;
        }
    },

    off: function(event, name, key) {
        switch (event) {
            case 'open':
            case 'onOpen':
            case 'onopen':
                delete this.onOpen[name][key];
                break;
            case 'close':
            case 'onClose':
            case 'onclose':
                delete this.onClose[name][key];
                break;
            case 'message':
            case 'onMessage':
            case 'onmessage':
                delete this.onMessage[name][key];
                break;
            default:
                console.log('Trying to remove a callback on a non existing event');
                break;
        }
    }
};

module.exports = new Server();
