"use strict";

exports.videoEntry = function(name, url) {
    return '<div style="clear: both;">'
        + '<div style="float: left;">---></div>'
        + '<div style="float: left;">'
            + '<a class="link" href="#" onclick="play(\''+url+'\')" style="color: #FFF; width: 100px; height: 15px;">'+name+'</a>'
        + '</div>'
        + '<div style="float: left;"><---</div>'
    + '</div>';
};
