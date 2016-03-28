"use strict";

/**
 * Config class to gain access to config variables via Config.get("xxx").
 */

var extend = require('extend'),
    Utils = require('./utils.js');

function Config() {
    var sharedPath = '../config/shared/' + Utils.env + '.json',
    localPath = '../config/' + process.env.role + '/' + Utils.env + '.json',
    shared = require(sharedPath),
    local = require(localPath);

    this.config = extend(true, shared, local);
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
