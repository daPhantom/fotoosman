"use strict";

//Load dependencies
var Utils = require('../utils.js'),
    Moment = require('moment'),
    YouTubeAPI = require('youtube-api');

//Constructor
function YouTube() {
    this.authenticate();
    this.get('fXIAildTRPY');
}

//Functions
YouTube.prototype = {
    authenticate: function() {
        var oauth = YouTubeAPI.authenticate({
            type: 'key',
            // key: 'AIzaSyAcmk59LQ3FL2I61jlth_lmRbJRq_r4kFU'
        });
    },

    get: function(code) {
        YouTubeAPI.videos.list({
            part: 'id, snippet, contentDetails, player',
            id: code
        }, function(err, data) {
            if (err) {
                return false;
            }
            Utils.logger().info('Duration in Seconds from YouTubeAPI.get(): ' + Moment.duration(data.items[0].contentDetails.duration).asSeconds());
        });
    },

    search: function(term) {
        var result = false;

        YouTubeAPI.search.list({
            part: 'id, snippet',
            q: term,
            maxResults: 1
        }, function(err, data) {
            if (err) {
                return false;
            }
            result = data;
        });

        return result;
    }
};

module.exports = new YouTube();
