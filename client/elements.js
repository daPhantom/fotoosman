"use strict";

exports.videoEntry = function(uuid) {
    return '<div style="clear: both;">'
        + '<div style="float: left;">---></div>'
        + '<div style="float: left;">'
            + '<a class="link" href="#" onclick="play(\''+uuid+'\')" style="color: #FFF; width: 100px; height: 15px;">'+uuid+'</a>'
        + '</div>'
        + '<div style="float: left;"><---</div>'
    + '</div>';
};

exports.newVideo = function(uuid) {
    return '<div style="background-color:#e9ffd9; position: absolute; width: 100%; bottom: 50px; height: 20px;border:1px solid #a6ca8a;"><span>New Video: </span> Check it out!</div>';
};
