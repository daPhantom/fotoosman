var SockJS = require('sockjs-client'),
    $ = jQuery = require('jquery'),
    Elements = require('./elements');

require('bootstrap');

$(document).ready(function() {
    var videos = {};

    showLoader();

    var sock = new SockJS('http://localhost:7005/client');

    var videoFrame = $('#video');

    var lastInput = '';

    sock.onopen = function() {
        hideLoader();
        console.log('open');
    };

    sock.onmessage = function(e) {
        showLoader();
        var message = JSON.parse(e.data);

        switch(message.type) {
            case 'switch':
                play(message.uuid, false);
                break;
            case 'video':
                // $('body').append(Elements.newVideo(message.video.uuid));
                $('#list').prepend(Elements.videoEntry(message.video.uuid));
                videos[message.video.uuid] = message.video;

                play(message.video.uuid, false);

                break;
            case 'videos':
                var uuid = false;
                message.videos.forEach(function(video) {
                    uuid = video.uuid;
                    $('#list').prepend(Elements.videoEntry(video.uuid));
                    videos[video.uuid] = video;
                });

                play(uuid, false);

                break;

        }
        hideLoader();
    };

    sock.onclose = function() {
        showLoader();
        console.log('close');
    };

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
