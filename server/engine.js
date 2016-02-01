"use strict";

//Load dependencies
var Utils = require('./utils.js');

//Constructor
function Engine() {
	this.clients = new Map();
}

//Functions
Engine.prototype = {
	handleIncomingClientMessage: function(conn, msg) {
		switch (msg.type) {
			default:
				Utils.logger().warn('received unknown incoming subscribe message from type ' + msg.type);
				break;
		}
	},

	addConnection: function(conn) {
      this.clients.set(conn.id, conn);
      Utils.logger().info("adding new client to list with connection " + conn.id);

	  var msg = {type: "video", url: "https://www.youtube.com/embed/YqBLxzn6kcU"};
	  this.sendToClient(conn, msg);
	},

	sendToClients: function(userId, message) {
		if (this.clients.has(userId)) {
			for (var connId of this.clients.get(userId).keys()) {
				var conn = this.clients.get(userId).get(connId);

				if(!this.sendToClient(conn, message)) {
					this.removeConnection(userId, conn);
					//break;
				}
			}
		} else {
			Utils.logger().info("can't push data to a non connected userId");
		}
	},

	broadcast: function(message) {
		for(var userId of this.clients.keys()) {
			for (var connId of this.clients.get(userId).keys()) {
				var conn = this.clients.get(userId).get(connId);

				if(!this.sendToClient(conn, message)) {
					this.removeConnection(userId, conn);
					//break;
				}
			}

		}
	},

	sendToClient: function(conn, message) {
		if(conn.writable) {
			Utils.logger().info("sending message to connection " + conn.id + " with data: " + message);
			return conn.write(JSON.stringify(message));
		}

		return false;
	},

	removeConnection: function (conn) {
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
