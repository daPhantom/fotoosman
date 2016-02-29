"use strict";

var Client = require('./client'),
    Elements = require('./elements'),
    Moment = require('moment');

function VideoManager() {
    this.videos = {};
    this.lastInput = '';

    self = this;

    Client.addEventListener('onOpen', 'videoManager', function() {
        $('#grid').html('');
    });

    Client.addEventListener('onMessage', 'videoManager', function(message) {
        switch (message.type) {
            case 'switch':
                self.play(message.code, false, message.elapsed);
                break;
            case 'video':
                $('#grid').prepend(Elements.videoEntry(message.video));
                self.videos[message.video.code] = message.video;

                self.play(message.video.code, false, message.video.elapsed);
                break;
            case 'videos':
                message.videos.forEach(function(video) {
                    $('#grid').prepend(Elements.videoEntry(video));
                    self.videos[video.code] = video;
                });
                self.play(self.videos[message.currentVideo].code, false, self.videos[message.currentVideo].elapsed);
                break;
        }
    });

    $(document).ready(function() {
        $('#input').bind("input propertychange", function(e) {
            var value = $('#input').val();
            if (value !== self.lastInput) {
                self.lastInput = value;
                self.sendVideoToServer(value);
            }
            $('#input').val('');
        });
    });
}

VideoManager.prototype = {
    play: function(code, clicked, elapsed) {
        var self = this;

        var video = self.videos[code];
        var url = false;

        if (typeof video === 'object') {
            url = 'https://www.youtube.com/embed/' + video.code + '?start=' + elapsed + '&rel=0&autoplay=1&controls=0&iv_load_policy=3';
        }

        if (url) {
            if (clicked) {
                this.sendSwitchToServer(code);
            }

            $('#video').attr('src', url);
            $('#title').text(video.title + ' - ' + Moment.duration(video.duration * 1000).format('hh:mm:ss'));
        }
    },

    sendVideoToServer: function(url) {
        var message = {
            type: "add",
            url: url
        };

        return Client.send(message);
    },

    sendSwitchToServer: function(code) {
        var message = {
            type: "switch",
            code: code
        };

        return Client.send(message);
    }
};

var videoManager = new VideoManager();

global.play = videoManager.play();
global.videos = videoManager.videos;

module.exports = videoManager;
