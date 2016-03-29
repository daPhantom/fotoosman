"use strict";

var argv = require('minimist')(process.argv.slice(2)),
    url = require('url');

//default fallback
var environment = 'production';

//environment as argument detection
if(typeof argv.environment !== 'undefined') {
    if(argv.environment == 'dev') {
        argv.environment = 'development';
    }
    if(argv.environment == 'prod') {
        argv.environment = 'production';
    }
    environment = argv.environment;
}

//environment from window location detection
if(typeof window !== 'undefined') {
    var href = window.location.href;
    switch(true) {
        case /127\.0\.0\.1/.test(href):
        case /foto\.osman/.test(href):
            environment = 'development';
            break;
        case /beta\.fotoosman\.de/.test(href):
            environment = 'beta';
            break;
    }
}

exports.env = exports.environment = environment;
exports.get = function() {
    return environment;
};
