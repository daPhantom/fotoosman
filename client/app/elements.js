"use strict";

exports.videoEntry = function(video) {
  return '<div class="grid-item yt" style="background-image: url(\'' + video.thumb +
    '\')" onclick="videoManager.play(\'' + video.code + '\', true, 0)"></div>';
};

exports.newVideo = function(code) {
  return '<div style="background-color:#e9ffd9; position: absolute; width: 100%; bottom: 50px; height: 20px;border:1px solid #a6ca8a;"><span>New Video: </span> Check it out!</div>';
};
