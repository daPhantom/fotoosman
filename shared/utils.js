"use strict";

var argv = require('minimist')(process.argv.slice(2));

var environment = 'production';
if(typeof argv.environment !== 'undefined') {
    if(argv.environment == 'dev') {
        argv.environment = 'development';
    }
    if(argv.environment == 'prod') {
        argv.environment = 'production';
    }
    environment = argv.environment;
}
exports.env = exports.environment = environment;

exports.microtime = function(get_as_float) {
    // discuss at: http://phpjs.org/functions/microtime/
    // original by: Paulo Freitas
    //   example 1: timeStamp = microtime(true);
    //   example 1: timeStamp > 1000000000 && timeStamp < 2000000000
    //   returns 1: true

    var now = new Date().getTime() / 1000;
    var s = parseInt(now, 10);

    return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
};

exports.code = function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};
