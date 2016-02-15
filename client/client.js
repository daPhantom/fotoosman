var SockJS = require('sockjs-client'),
    $ = jQuery = require('jquery'),
    Elements = require('./elements'),
    Masonry = require('masonry-layout');

require('bootstrap');

$(document).ready(function() {
    var videos = {};

    var sock = null;
    var sockInterval = null;

    var videoFrame = $('#video');

    var lastInput = '';

    var new_sock = function() {
        sock = new SockJS('http://localhost:7005/client');
        clearInterval(sockInterval);

        sock.onopen = function() {
            $('#grid').html('');
            hideLoader();
        };

        sock.onclose = function() {
            showLoader();
            sock = null;
            sockInterval = setInterval(function() {
                new_sock();
            }, 2000);
        };

        sock.onmessage = function(e) {
            var message = JSON.parse(e.data);

            switch(message.type) {
                case 'switch':
                    play(message.uuid, false);
                    break;
                case 'video':
                    // $('body').append(Elements.newVideo(message.video.uuid));
                    $('#grid').prepend(Elements.videoEntry(message.video.uuid, message.video.type, message.video.code));
                    videos[message.video.uuid] = message.video;

                    play(message.video.uuid, false);

                    break;
                case 'videos':
                    var uuid = false;
                    message.videos.forEach(function(video) {
                        uuid = video.uuid;
                        $('#grid').prepend(Elements.videoEntry(video.uuid, video.type, video.code));
                        videos[video.uuid] = video;
                    });

                    play(uuid, false);

                    break;

            }
        };
    };

    new_sock();

    var msnry = new Masonry('#grid', {
        itemSelector: '.grid-item',
        columnWidth: 320
    });

    function sendMessage(message) {
        if(typeof message !== 'string') {
            try {
                message = JSON.stringify(message);
            } catch(e) {
                return false;
            }
        }

        return sock.send(message);
    }

    function sendVideoToServer(url) {
        var message = {type: "add", url: url};
        return sendMessage(message);
    }

    function sendSwitchToServer(uuid) {
        var message = {type: "switch", uuid: uuid};
        return sendMessage(message);
    }

    function play(uuid, clicked) {
        var video = videos[uuid];
        var url = false;

        if(typeof video === 'object') {
            switch(video.type) {
                case 'yt':
                    url = 'https://www.youtube.com/embed/' + video.code + '?&rel=0&autoplay=1&controls=0&iv_load_policy=3';
                    break;
                case 'yp':
                    url = 'http://www.youporn.com/embed/' + video.code;
                    break;
                case 'v':
                    url = 'https://player.vimeo.com/video/' + video.code + '?autoplay=1&badge=0&byline=0&color=000000&portrait=0';
                    break;
            }
        }

        if(url) {
            if(clicked) {
                sendSwitchToServer(uuid);
            }

            $('#video').attr('src', url);
        }
    }

    function showLoader() {
        $('#loader').modal();
    }

    function hideLoader() {
        $('#loader').modal('hide');
    }

    $('#input').bind("input propertychange", function(e) {
        var value = $('#input').val();
        if(value !== lastInput) {
            lastInput = value;
            sendVideoToServer(value);
        }
        $('#input').val('');
    })

    global.showLoader = showLoader;
    global.hideLoader = hideLoader;
    global.play = play;
    global.videos = videos;
    global.$ = $;
});
