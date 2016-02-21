var SockJS = require('sockjs-client'),
    $ = jQuery = require('jquery'),
    Elements = require('./elements'),
    Masonry = require('masonry-layout'),
    Moment = require('moment');

require('moment-duration-format');

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

            console.log(message);

            switch (message.type) {
                case 'switch':
                    play(message.code, false, message.elapsed);
                    break;
                case 'video':
                    $('#grid').prepend(Elements.videoEntry(message.video));
                    videos[message.video.code] = message.video;

                    play(message.video.code, false, message.video.elapsed);
                    break;
                case 'videos':
                    message.videos.forEach(function(video) {
                        $('#grid').prepend(Elements.videoEntry(video));
                        videos[video.code] = video;
                    });
                    console.log(videos[message.currentVideo]);
                    play(videos[message.currentVideo].code, false, videos[message.currentVideo].elapsed);
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

    function sendSwitchToServer(code) {
        var message = {
            type: "switch",
            code: code
        };
        return sendMessage(message);
    }

    function play(code, clicked, elapsed) {
        var video = videos[code];
        var url = false;

        if (typeof video === 'object') {
            url = 'https://www.youtube.com/embed/' + video.code + '?start=' + elapsed + '&rel=0&autoplay=1&controls=0&iv_load_policy=3';
        }

        if (url) {
            if (clicked) {
                sendSwitchToServer(code);
            }

            $('#video').attr('src', url);
            console.log(Moment.duration(video.duration));
            $('#title').text(video.title + ' - ' + Moment.duration(video.duration * 1000).format('hh:mm:ss'));
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
