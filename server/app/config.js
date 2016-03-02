"use strict";

var config = {
    'ports': [7005],
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
