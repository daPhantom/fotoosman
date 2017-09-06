"use strict";

/**
 * Config class to gain access to config variables via Config.get("xxx").
 */

var Env = require('./env');

var config = {
  'development': {
    "host": "http:\/\/192.168.2.104",
    "ports": [7005],
    "port": 7005,
    "boards": [
      "random",
      "music",
      "fun"
    ],
    "loglevel": 0
  },
  'beta': {
    "host": "http:\/\/beta.fotoosman.de",
    "ports": [7005],
    "port": 7005,
    "boards": [
      "random",
      "music",
      "fun"
    ],
    "loglevel": 0
  },
  'production': {
    "host": "http:\/\/fotoosman.de",
    "ports": [7005],
    "port": 7005,
    "boards": [
      "random",
      "music",
      "fun"
    ],
    "loglevel": 4
  }
};

function Config() {
  this.config = config[Env.env];
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
