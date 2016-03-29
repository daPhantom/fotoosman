"use strict";

function Chat(board) {
    this.board = board;
    this.messages = [];
}

Chat.prototype = {
    handleIncomingClientMessage: function(conn, msg) {
        switch (msg.type) {
            case 'chat.message':
                this.add(msg.url);
                break;
        }
    },

    all: function() {
        return this.messages;
    },

    add: function(conn, msg) {
        console.log(msg);
    }
};

module.exports = Chat;
