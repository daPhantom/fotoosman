var $ = jQuery = require('jquery');

global.$ = $;

var Client = require('./client'),
    VideoManager = require('./videoManager'),
    Elements = require('./elements'),
    Masonry = require('masonry-layout'),
    Moment = require('moment');

require('moment-duration-format');

require('bootstrap');

$(document).ready(function() {
    var videoFrame = $('#video');

    var lastInput = '';

    Client.addEventListener('onOpen', 'client', function() {
        hideLoader();
    });

    Client.addEventListener('onClose', 'client', function() {
        showLoader();
    });

    Client.connect();

    var msnry = new Masonry('#grid', {
        itemSelector: '.grid-item',
        columnWidth: 196
    });

    function showLoader() {
        $('#loader').modal();
    }

    function hideLoader() {
        $('#loader').modal('hide');
    }

    global.showLoader = showLoader;
    global.hideLoader = hideLoader;
});
