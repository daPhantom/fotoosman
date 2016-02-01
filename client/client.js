var SockJS = require('sockjs-client'),
    $ = require('jquery');

var sock = new SockJS('http://localhost:7005/client');

var videoFrame = $('#video');

sock.onopen = function() {
    console.log('open');
};
sock.onmessage = function(e) {
    var message = JSON.parse(e.data);

    switch(message.type) {
        case 'video':
        $(document).ready(function() {
            $('#video').attr('src', message.url + '?&rel=0&autoplay=1&controls=0&iv_load_policy=3');
        });
        break;
    }

    console.log('message', e.data);
};
sock.onclose = function() {
    console.log('close');
};
