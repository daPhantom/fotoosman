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

            switch (message.type) {
                case 'switch':
                    play(message.code, false);
                    break;
                case 'video':
                    $('#grid').prepend(Elements.videoEntry(message.video));
                    videos[message.video.code] = message.video;

                    play(message.video.code, false);

                    break;
                case 'videos':
                    message.videos.forEach(function(video) {
                        $('#grid').prepend(Elements.videoEntry(video));
                        videos[video.code] = video;
                    });

                    play(message.currentVideo.video.code, false, message.currentVideo.elapsed);

                    break;

            }
        };
    };

    new_sock();

    var msnry = new Masonry('#grid', {
        itemSelector: '.grid-item',
        columnWidth: 196
    });

    function sendMessage(message) {
        if (typeof message !== 'string') {
            try {
                message = JSON.stringify(message);
            } catch (e) {
                return false;
            }
        }

        return sock.send(message);
    }

    function sendVideoToServer(url) {
        var message = {
            type: "add",
            url: url
        };
        return sendMessage(message);
    }

    function sendSwitchToServer(uuid) {
        var message = {
            type: "switch",
            code: uuid
        };
        return sendMessage(message);
    }

    function play(uuid, clicked, elapsed) {
        var video = videos[uuid];
        var url = false;

        if (typeof video === 'object') {
            url = 'https://www.youtube.com/embed/' + video.code + '?start=' + elapsed + '&rel=0&autoplay=1&controls=0&iv_load_policy=3';
        }

        if (url) {
            if (clicked) {
                sendSwitchToServer(uuid);
            }

            $('#video').attr('src', url);
            $('#title').text(video.title);
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
        if (value !== lastInput) {
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
