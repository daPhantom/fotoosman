"use strict";

//Load dependencies
var Logger = require('shared/logger'),
    Videos = require('./videos'),
    Chat = require('./chat');

//Constructor
function Board(name) {
    this.clients = new Map();
    this.videos = new Videos(this);
    this.chat = new Chat(this);
}

//Functions
Board.prototype = {
    handleIncomingClientMessage: function(conn, msg) {
        var self = this;

        switch (true) {
            case /videos\./.test(msg.type):
                this.videos.handleIncomingClientMessage(conn, msg);
                break;
            case /chat\./.test(msg.type):
                this.chat.handleIncomingClientMessage(conn, msg);
                break;
            default:
                Logger.warn('received unknown incoming subscribe message from type ' + msg.type);
                break;
        }
    },

    addConnection: function(conn) {
        var self = this;

        self.clients.set(conn.id, conn);
        Logger.info("adding new client to list with connection " + conn.id);
        var msg = {
            type: "videos",
            videos: self.videos.all(),
            currentVideo: self.videos.getCurrentVideo()
        };
        self.sendToClient(conn, msg);
        var msg = {
            type: "chat",
            messages: self.chat.all(),
        };
        self.sendToClient(conn, msg);
    },

    broadcast: function(message) {
        for (var connId of this.clients.keys()) {
            var conn = this.clients.get(connId);
            if (!this.sendToClient(conn, message)) {
                this.removeConnection(conn);
                //break;
            }
        }
    },

    sendToClient: function(conn, message) {
        if (conn.writable) {
            if (typeof message !== 'string') {
                try {
                    message = JSON.stringify(message);
                } catch (e) {
                    Logger.error("error stringifying message: " + e.message);
                    return false;
                }
            }

            Logger.info("sending message to connection " + conn.id + " with data: " + message);

            return conn.write(message);
        }

        return false;
    },

    removeConnection: function(conn) {
        if (this.clients.has(conn.id)) {
            var id = conn.id;

            //close connection
            conn.close();
            conn = null;

            this.clients.delete(id);

            Logger.info('removed dead connection ' + id);
        }
    },
};

module.exports = Board;
