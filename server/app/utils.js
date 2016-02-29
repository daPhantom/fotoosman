"use strict";

var logger;

function PhntmLogger() {
    var phntmLogger = {};
    var logLevel = require('loglevel');
    var moment = require('moment');

    phntmLogger.__proto__ = logLevel;

    phntmLogger.trace = function() {
        for (var i = 0; i < arguments.length; i++) {
            logLevel.trace(moment().format(), '[TRACE]', arguments[i]);
        }
    };
    phntmLogger.debug = function() {
        for (var i = 0; i < arguments.length; i++) {
            logLevel.debug(moment().format(), '[DEBUG]', arguments[i]);
        }
    };
    phntmLogger.info = function() {
        for (var i = 0; i < arguments.length; i++) {
            logLevel.info(moment().format(), '[INFO]', arguments[i]);
        }
    };
    phntmLogger.warn = function() {
        for (var i = 0; i < arguments.length; i++) {
            logLevel.warn(moment().format(), '[WARN]', arguments[i]);
        }
    };
    phntmLogger.error = function() {
        for (var i = 0; i < arguments.length; i++) {
            logLevel.error(moment().format(), '[ERROR]', arguments[i]);
        }
    };
    phntmLogger.stat = function() {
        for (var i = 0; i < arguments.length; i++) {
            logLevel.info(moment().format(), '[STAT]', arguments[i]);
        }
    };

    return phntmLogger;
}

exports.logger = function() {
    if (typeof logger === 'undefined') {
        logger = new PhntmLogger();
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

exports.code = function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

/**
 * overwrite native console.log with new phntmLogger
 */
(function() {
    if (console.log) {
        console.log = function() {
            for (var i = 0; i < arguments.length; i++) {
                exports.logger().info(arguments[i]);
            }
        }
    }
})();
