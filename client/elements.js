"use strict";

exports.videoEntry = function(uuid, url) {
    return '<div style="clear: both;">'
        + '<div style="float: left;">---></div>'
        + '<div style="float: left;">'
            + '<a class="link" href="#" onclick="play(\''+uuid+'\')" style="color: #FFF; width: 100px; height: 15px;">'+uuid+'</a>'
        + '</div>'
        + '<div style="float: left;"><---</div>'
    + '</div>';
};
