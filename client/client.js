var SockJS = require('sockjs-client'),
    $ = jQuery = require('jquery'),
    Elements = require('./elements');

require('bootstrap');

$(document).ready(function() {
    var videos = {};

    showLoader();

    var sock = new SockJS('http://localhost:7005/client');

    var videoFrame = $('#video');

    sock.onopen = function() {
        hideLoader();
        console.log('open');
    };

    sock.onmessage = function(e) {
        showLoader();
        var message = JSON.parse(e.data);

        switch(message.type) {
            case 'video':
                var url = message.url + '?&rel=0&autoplay=1&controls=0&iv_load_policy=3';
                $('#list').prepend(Elements.videoEntry(message.name, url));
                play(url);
                break;
            case 'videos':
                var uuid = false;
                message.videos.forEach(function(video) {
                    uuid = video.uuid;
                    $('#list').prepend(Elements.videoEntry(video.uuid, url));
                    videos[video.uuid] = video;
                });

                play(uuid);

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

    function play(uuid) {
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
        sendVideoToServer(value);
    })


    global.showLoader = showLoader;
    global.hideLoader = hideLoader;
    global.play = play;
    global.videos = videos;
});
