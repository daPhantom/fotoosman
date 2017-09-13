"use strict";

//Load dependencies
var YouTubeAPI = require('youtube-api'),
  Logger = require('shared/Logger');

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
        Logger.error(err);
        return false;
      }

      if (data.items.length > 0) {
        callback(data.items);
      }
    });
  },

  parsePlaylist: function(playlistId, callback) {
    var self = this;
    YouTubeAPI.playlistItems.list({
      part: 'id, snippet, contentDetails',
      playlistId: playlistId,
      maxResults: 50
    }, function(err, data) {
      if (err) {
        Logger.error(err);
        return false;
      }

      if (data.items.length > 0) {
        var codes = '';
        for (let playlistItem of data.items) {
          codes += playlistItem.contentDetails.videoId + ',';
        }
        codes = codes.slice(0, -1);

        self.parse(codes, callback);
      }
    });
  }
};

module.exports = new YouTube();
