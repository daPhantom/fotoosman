"use strict";

var Utils = require('./utils'),
    argv = require('minimist')(process.argv.slice(2)),
    URL = require('url');

if (typeof argv.logLevel !== 'undefined') {
    //set log level to the one which was set via args
    Utils.logger().setLevel(argv.logLevel);
} else {
    //set production log level to 4
    Utils.logger().setLevel(4);
}

function Server() {
    //dependencies
    var Engine = require('./engine');

    //load engine
    this.engine = new Engine();

    //all client servers
    this.clientServers = [];

    //all HTTP(s) servers
    this.httpServers = [];
}

Server.prototype = {
    start: function() {
        this._initHTTPServers();
        this._attachClientServers();
        this._bootImage();
    },

    _initHTTPServers: function() {
        var server = this;

        var ports = [7005],
            HTTP = require('http');

        ports.forEach(function(port) {
            var httpServer = HTTP.createServer(server._bindStatsListeners);

            httpServer.listen(port, '0.0.0.0');
            server.httpServers.push(httpServer);

            Utils.logger().info('HTTP & Stats server running on ' + port + '. SSL is ' + (argv.ssl ? 'enabled' : 'disabled') + '.');
        });
    },

    _attachClientServers: function() {
        var server = this,
            SockJS = require('sockjs');

        server.httpServers.forEach(function(httpServer) {
            var clientServer = SockJS.createServer();
            clientServer.installHandlers(httpServer, {
                prefix: '/client'
            });

            clientServer.on('connection', function(connection) {
                server.engine.addConnection(connection);

                connection.on('close', function() {
                    server.engine.removeConnection(connection);
                });

                connection.on('data', function(message) {
                    try {
                        message = JSON.parse(message);
                        server.engine.handleIncomingClientMessage(connection, message);
                    } catch (e) {
                        Utils.logger().error(e.message);
                        Utils.logger().error("Error trying to parse incoming message: " + message);
                    }
                });
            });

            server.clientServers.push(clientServer);
        });
    },

    _bindStatsListeners: function(request, response) {
        response.writeHead(200, {
            'Content-type': 'text/plain',
            'Access-Control-Allow-Origin': '*'
        });

        try {
            var uri = URL.parse(request.url).pathname;
        } catch (e) {
            response.write('ERROR!');
        }

        if (uri == '/stats' || uri == '/stats/') {
            Stats.outputToResponse(response, server);
        } else {
            response.write("I am a wizard!");
        }

        response.end();
    },

    _bootImage: function() {
        var fs = require('fs');

        require.extensions['.txt'] = function(module, filename) {
            module.exports = fs.readFileSync(filename, 'utf8');
        };

        var image = require("./boot.txt");

        console.log(image);
    }
};

var server = new Server();
server.start();
