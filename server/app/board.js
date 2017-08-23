"use strict";

//Load dependencies
var Logger = require('shared/logger'),
  Messenger = require('shared/Messenger'),
  Videos = require('./videos'),
  VideosMessage = require('shared/messages/Videos'),
  Chat = require('./chat'),
  Troll = require('./troll');

//Constructor
function Board(name) {
  this.messenger = new Messenger();
  this.clients = new Map();
  this.videos = new Videos(this);
  this.chat = new Chat(this);
  this.troll = new Troll(this);
}

//Functions
Board.prototype = {
  onMessage: function(conn, msg) {
    var self = this;

    this.messenger.receive(conn, msg);
    //
    // switch (true) {
    //   case /videos\./.test(msg.type):
    //     this.videos.handleIncomingClientMessage(conn, msg);
    //     break;
    //   case /chat\./.test(msg.type):
    //     this.chat.handleIncomingClientMessage(conn, msg);
    //     break;
    //   case /troll\./.test(msg.type):
    //     this.troll.handleIncomingClientMessage(conn, msg);
    //   default:
    //     Logger.warn(
    //       'received unknown incoming subscribe message from type ' +
    //       msg.type
    //     );
    //     break;
    // }
  },

  addConnection: function(conn) {
    var self = this;

    self.clients.set(conn.id, conn);
    Logger.info("adding new client to list with connection " + conn.id);
    var msg = new VideosMessage(this.videos.all(), this.videos.getCurrentVideo());
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
    return this.messenger.send(conn, message);
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
