"use strict";

//Load dependencies
var Utils = require('./utils.js');

//Constructor
function Videos() {
    this.videos = [];
    this.dummy();
}

//Functions
Videos.prototype = {
    dummy: function() {
        this.videos.push({type: 'yt', uuid: Utils.uuid(), 'code': 'fDsyH9AVilQ'});
        this.videos.push({type: 'yt', uuid: Utils.uuid(), 'code': 'Ffppy1-yYh0'});
        this.videos.push({type: 'yt', uuid: Utils.uuid(), 'code': 'refCJcJJZso'});
    },

    get: function(index) {
        var video = this.videos[index];
        return video;
    },

    getRandom: function() {
        return this.get(Math.floor(Math.random()*this.videos.length));
    },

    all: function() {
        return this.videos;
    },

    add: function(url) {
        if(url.indexOf('youtu') !== -1) {
            this.addYouTube(url);
        } else if(url.indexOf('youpo') !== -1) {
            this.addYouPorn(url);
        }
    },

    addYouTube: function(url) {
        var video = false;

        var regex = /([\w-]{11})/;
        var matches = url.match(regex);

        if(typeof matches[1] !== 'undefined') {
            video = matches[1];
        }

        if(video) {
            this.videos.push({type: "yt", uuid: Utils.uuid(), code: video});
            Utils.logger().info("Added youtube video to list. Code: " + video);
        }
    },

    addYouPorn: function(url) {
        var video = false;

        var regex = /([\d]+)/;
        var matches = url.match(regex);

        if(typeof matches[1] !== 'undefined') {
            video = matches[1];
        }

        if(video) {
            this.videos.push({type: "yp", uuid: Utils.uuid(), code: video});
            Utils.logger().info("Added youporn video to list. Code: " + video);
        }
    }
};

module.exports = new Videos();
