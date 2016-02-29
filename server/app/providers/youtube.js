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
        var config = require('../credentials/youtube.json');
        YouTubeAPI.authenticate({
            type: 'key',
            key: config.key
        });
    },

    parse: function(code, callback) {
        YouTubeAPI.videos.list({
            part: 'id, snippet, contentDetails, player',
            id: code
        }, function(err, data) {
            if (err) {
                Utils.logger().error(err);
                return false;
            }

            if(data.items.length > 0) {
                callback(data.items[0]);
            }
        });
    }
};

module.exports = new YouTube();