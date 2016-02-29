'use strict';

var SockJS = require('sockjs-client'),
    Config = require('./config');

function Client() {
    this.socket = null;
    this.socketInterval = null;

    this.onOpen = {};
    this.onMessage = {};
    this.onClose = {};
}

Client.prototype = {
    connect: function() {
        var self = this;

        var host = Config.get('host'),
            port = Config.get('port'),
            prefix = Config.get('prefix');

        self.socket = new SockJS(host + ':' + port + prefix);
        clearInterval(self.socketInterval);

        self.socket.onopen = function() {
            for (var key in self.onOpen) {
                self.onOpen[key]();
            }
        };

        self.socket.onclose = function() {
            for (var key in self.onClose) {
                self.onClose[key]();
            }

            self.socket = null;
            self.socketInterval = setInterval(function() {
                self.connect();
            }, 2000);
        };

        self.socket.onmessage = function(e) {
            try {
                var message = JSON.parse(e.data);
            } catch (error) {
                console.log(error.message);
                return;
            }

            for (var key in self.onMessage) {
                self.onMessage[key](message);
            }
        };
    },

    send: function(message) {
        if (typeof message !== 'string') {
            try {
                message = JSON.stringify(message);
            } catch (error) {
                console.log(error.message);
            }
        }

        this.socket.send(message);
    },

    addEventListener: function(event, key, callback) {
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

    removeEventListener: function(event, key) {
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

module.exports = new Client();
