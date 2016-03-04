"use strict";

//Load dependencies
var Utils = require('./utils'),
    Videos = require('./videos');

//Constructor
function Engine(name) {
    this.clients = new Map();
    this.videos = new Videos(this)
}

//Functions
Engine.prototype = {
    handleIncomingClientMessage: function(conn, msg) {
        var self = this;

        switch (msg.type) {
            case 'add':
                self.videos.add(msg.url);
                break;

            case 'switch':
                self.videos.switch(msg.code);
                break;

            default:
                Utils.logger().warn('received unknown incoming subscribe message from type ' + msg.type);
                break;
        }
    },

    addConnection: function(conn) {
        var self = this;

        self.clients.set(conn.id, conn);
        Utils.logger().info("adding new client to list with connection " + conn.id);
        var msg = {
            type: "videos",
            videos: self.videos.all(),
            currentVideo: self.videos.getCurrentVideo()
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
                    Utils.logger().error("error stringifying message: " + e.message);
                    return false;
                }
            }

            Utils.logger().info("sending message to connection " + conn.id + " with data: " + message);

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

            Utils.logger().info('removed dead connection ' + id);
        }
    },
};

module.exports = Engine;
