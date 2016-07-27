"use strict";

function Troll(board) {
    this.board = board;
}

Troll.prototype = {
    handleIncomingClientMessage: function(conn, msg) {
        switch (msg.type) {
            case 'troll.troll':
                this.board.broadcast({
                    type: 'troll',
                });
                break;
        }
    },
};

module.exports = Troll;
