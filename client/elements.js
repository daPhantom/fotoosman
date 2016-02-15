"use strict";

exports.videoEntry = function(uuid, type, code) {
    var image = '';

    switch(type) {
        case 'yt':
            image = '//i.ytimg.com/vi_webp/' + code + '/mqdefault.webp';
            break;
    }

    return '<div class="grid-item ' + type + '" style="background-image: url(\'' + image + '\')" onclick="play(\'' + uuid + '\')"></div>';
};

exports.newVideo = function(uuid) {
    return '<div style="background-color:#e9ffd9; position: absolute; width: 100%; bottom: 50px; height: 20px;border:1px solid #a6ca8a;"><span>New Video: </span> Check it out!</div>';
};
