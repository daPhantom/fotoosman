"use strict";

var extend = require('extend'),
    globalConfig = require('../../config/global.json');

var config = {

};

function Config() {
    this.config = extend(true, globalConfig, config);
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
