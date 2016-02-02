var SockJS = require('sockjs-client'),
    $ = jQuery = require('jquery'),
    Elements = require('./elements');

require('bootstrap');

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
        $(document).ready(function() {
            $('#list').prepend(Elements.videoEntry(message.name, url));
            play(url);
        });
        break;
    }
    hideLoader();
};

sock.onclose = function() {
    showLoader();
    console.log('close');
};

function play(url) {
    $(document).ready(function() {
        $('#video').attr('src', url);
    });
}

function showLoader() {
    $(document).ready(function() {
        $('#loader').modal();
    });
}

function hideLoader() {
    $(document).ready(function() {
        $('#loader').modal('hide');
    });
}

global.showLoader = showLoader;
global.hideLoader = hideLoader;
global.play = play;
