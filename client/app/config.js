"use strict";

var config = {
    'host': 'http://localhost',
    'port': 7005,
    'boards': [
        'random',
        'music',
    ]
};

function Config() {
    this.config = config;
}

Config.prototype = {
    get: function(key) {
        if (typeof this.config[key] !== 'undefined') {
            return this.config[key];
        }

        return false;
    }
};

module.exports = new Config();
