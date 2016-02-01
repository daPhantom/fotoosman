"use strict";

var logger;

function WhowLogger() {
    var whowLogger = {};
    var logLevel = require('loglevel');
    var moment = require('moment');

    whowLogger.__proto__ = logLevel;

    whowLogger.trace = function() {
        for (var i = 0; i < arguments.length; i++) {
            logLevel.trace(moment().format(), '[TRACE]', arguments[i]);
        }
    };
    whowLogger.debug = function() {
        for (var i = 0; i < arguments.length; i++) {
            logLevel.debug(moment().format(), '[DEBUG]', arguments[i]);
        }
    };
    whowLogger.info = function() {
        for (var i = 0; i < arguments.length; i++) {
            logLevel.info(moment().format(), '[INFO]', arguments[i]);
        }
    };
    whowLogger.warn = function() {
        for (var i = 0; i < arguments.length; i++) {
            logLevel.warn(moment().format(), '[WARN]', arguments[i]);
        }
    };
    whowLogger.error = function() {
        for (var i = 0; i < arguments.length; i++) {
            logLevel.error(moment().format(), '[ERROR]', arguments[i]);
        }
    };
    whowLogger.stat = function() {
        for (var i = 0; i < arguments.length; i++) {
            logLevel.info(moment().format(), '[STAT]', arguments[i]);
        }
    };

    return whowLogger;
}

exports.logger = function() {
    if(typeof logger === 'undefined') {
        logger = new WhowLogger();
    }

    return logger;
};

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

/**
 * overwrite native console.log with new whowLogger
 */
(function(){
    if(console.log){
        console.log = function() {
            for (var i = 0; i < arguments.length; i++) {
                exports.logger().info(arguments[i]);
            }
        }
    }
})();
