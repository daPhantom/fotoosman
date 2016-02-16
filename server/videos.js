"use strict";

//Load dependencies
var Utils = require('./utils.js'),
    Moment = require('moment'),
    YouTube = require('./providers/youtube.js');

//Constructor
function Videos(engine) {
    this.engine = engine;
    this.currentVideo = false;
    this.videos = new Map();

    this.loop();
}

//Functions
Videos.prototype = {
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

        if(typeof video !== 'object') {
            return false;
        }

        return this.changeCurrentVideo(video);
    },

    update: function(video) {
        if(this.videos.has(video.code)) {
            var msg = {
                type: "switch",
                code: video.code
            };
        } else {
            var msg = {
                type: "video",
                video: video
            };
        }

        return this.engine.broadcast(msg);
    },

    parseYouTube: function(url) {
        var self = this;

        var code = false;

        var regex = /([\w-]{11})/;
        var matches = url.match(regex);

        if (typeof matches[1] !== 'undefined') {
            code = matches[1];
        }

        if (code) {
            YouTube.parse(code, function(data) {
                var video = {
                    code: data.id,
                    title: data.snippet.title,
                    duration: Moment.duration(data.contentDetails.duration).asSeconds(),
                    thumb: data.snippet.thumbnails.medium.url
                };

                self.changeCurrentVideo(video);
                self.videos.set(code, video);
            });
        }
    },

    changeCurrentVideo: function(video) {
        this.currentVideo = {
            video: video,
            elapsed: 0,
        };

        this.update(video);
    },

    getCurrentVideo: function() {
        return this.currentVideo;
    },

    loop: function() {
        var self = this;

        if (typeof this.currentVideo === 'object') {
            this.currentVideo.elapsed++;

            //+3 for slow internet connections
            if (this.currentVideo.elapsed > (this.currentVideo.video.duration + 3)) {
                this.changeCurrentVideo(this.random());
            }
        }

        setTimeout(function() {
            self.loop()
        }, 1000);
    }
};

module.exports = Videos;
