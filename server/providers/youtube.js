"use strict";

//Load dependencies
var Utils = require('../utils.js'),
    Videos = require('../videos.js'),
    YouTubeAPI = require('youtube-api');

//Constructor
function YouTube() {
    this.authenticate();
}

//Functions
YouTube.prototype = {
    authenticate: function() {
        YouTubeAPI.authenticate({
            type: 'key',
            key: 'AIzaSyAcmk59LQ3FL2I61jlth_lmRbJRq_r4kFU'
        });
    },

    parse: function(code, callback) {
        YouTubeAPI.videos.list({
            part: 'id, snippet, contentDetails, player',
            id: code
        }, function(err, data) {
            if (err) {
                return false;
            }

            callback(data.items[0]);
        });
    }
};

module.exports = new YouTube();
