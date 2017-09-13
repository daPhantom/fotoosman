"use strict";

//Load dependencies
var moment = require('moment'),
  YouTube = require('./providers/youtube'),
  fs = require('fs'),
  JsonHelper = require('shared/jsonHelper');

//Constructor
function Videos(board) {
  var self = this;

  self.dumpFile = process.cwd() + '/dump/' + board.name + '.json';

  self.board = board;
  self.currentVideo = false;
  self.videos = new Map();

  self.restoreDump();

  self.loop();

  setTimeout(function() {
    self.dump();
  }, 60000);
}

//Functions
Videos.prototype = {
  restoreDump: function() {
    var self = this;

    fs.readFile(self.dumpFile, 'utf8', function(err, data) {
      if (err) {
        return console.log(err);
      }
      self.videos = JsonHelper.jsonToStrMap(data);

      console.log("Restored videos for " + self.board.name + " successfuly");
    });
  },

  handleIncomingClientMessage: function(conn, msg) {
    switch (msg.type) {
      case 'videos.add':
        this.add(msg.url);
        break;

      case 'videos.switch':
        this.switch(msg.code);
        break;
    }
  },

  all: function() {
    var videoArr = [];

    for (let video of this.videos.values()) {
      videoArr.push(video);
    }

    return videoArr;
  },

  random: function() {
    var videos = this.all();
    return videos[Math.floor(Math.random() * videos.length)];
  },

  add: function(url) {
    if (url.indexOf('youtu') !== -1) {
      return this.parseYouTube(url);
    }
  },

  switch: function(code) {
    var video = this.videos.get(code);

    if (typeof video !== 'object') {
      return false;
    }

    return this.changeCurrentVideo(video);
  },

  update: function(video) {
    if (this.videos.has(video.code)) {
      var msg = {
        type: "switch",
        code: video.code,
        elapsed: video.elapsed
      };
    } else {
      var msg = {
        type: "video",
        video: video
      };
    }

    return this.board.broadcast(msg);
  },

  parseYouTube: function(url) {
    var _self_ = this;

    var regex = /^.*(youtu.+\/|list=|watch\?v=)([^#\&\?]*)$/;
    var matches = url.match(regex);

    if (typeof matches[1] !== 'undefined' && typeof matches[1] !== 'undefined') {
      if (matches[1] == "list=") {
        _self_.parseYouTubePlaylist(matches[2]);
      } else {
        _self_.parseYouTubeVideo(matches[2]);
      }
    }
  },

  parseYouTubeVideo: function(code) {
    var self = this;

    YouTube.parse(code, function(data) {
      data = data[0];

      var video = {
        code: data.id,
        title: data.snippet.title,
        duration: moment.duration(data.contentDetails.duration).asSeconds(),
        thumb: data.snippet.thumbnails.medium.url,
        elapsed: 0
      };

      self.changeCurrentVideo(video);
      self.videos.set(code, video);
    });
  },

  parseYouTubePlaylist: function(playlistId) {
    var self = this;

    YouTube.parsePlaylist(playlistId, function(playlistItems) {
      for (let playlistItem of playlistItems) {

        var video = {
          code: playlistItem.id,
          title: playlistItem.snippet.title,
          duration: moment.duration(playlistItem.contentDetails.duration).asSeconds(),
          thumb: playlistItem.snippet.thumbnails.medium.url,
          elapsed: 0
        };

        self.update(video);
        self.videos.set(playlistItem.id, video);
      }
      self.changeCurrentVideo(self.random());
    });
  },

  changeCurrentVideo: function(video) {
    this.currentVideo = video.code;
    this.update(video);
  },

  getCurrentVideo: function() {
    return this.currentVideo;
  },

  loop: function() {
    var self = this;

    if (this.currentVideo) {
      this.videos.get(this.currentVideo).elapsed++;

      //+3 for slow internet connections
      if (this.videos.get(this.currentVideo).elapsed > (this.videos.get(this.currentVideo).duration +
          3)) {
        this.videos.get(this.currentVideo).elapsed = 0;
        this.changeCurrentVideo(this.random());
      }
    } else if (this.videos.size > 0) {
      this.currentVideo = this.random().code;
    }

    setTimeout(function() {
      self.loop()
    }, 1000);
  },

  dump: function() {
    var self = this;

    var path = process.cwd();

    fs.writeFile(path + "/dump/" + self.board.name + ".json", JsonHelper.strMapToJson(this.videos),
      function(err) {
        if (err) {
          return console.log(err);
        }

        console.log("Videos for board " + self.board.name + " dumped successfuly");
      });

    setTimeout(function() {
      self.dump();
    }, 60000);
  }
};

module.exports = Videos;
