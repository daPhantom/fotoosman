"use strict";

/**
 * Logger class to overwrite loglevel functionality
 * and make log output more customizable.
 * Unfortunately loglevel is not designed to be
 * inherited since it's prototype is undefined (WTF?!).
 * If you need a loglevel function which is not yet present on the Logger
 * you have to pass it into the prototype object
 * and call it on the loglevel object.
 *
 * Use Logger.setLevel(0-5) to set the log level you want to use.
 *
 * 0 => trace
 * 1 => debug
 * 2 => info
 * 3 => warn
 * 4 => error
 * 5 => silent (no output)
 */

var argv = require('minimist')(process.argv.slice(2)),
    Config = require('../../shared/config'),
    loglevel = require('loglevel'),
    moment = require('moment');

function Logger() {

}

Logger.prototype = {
    setLevel: function(level) {
        loglevel.setLevel(level);
    },
    trace: function() {
        for (var i = 0; i < arguments.length; i++) {
            loglevel.trace(moment().format(), '[TRACE]', arguments[i]);
        }
    },
    debug: function() {
        for (var i = 0; i < arguments.length; i++) {
            loglevel.debug(moment().format(), '[DEBUG]', arguments[i]);
        }
    },
    info: function() {
        for (var i = 0; i < arguments.length; i++) {
            loglevel.info(moment().format(), '[INFO]', arguments[i]);
        }
    },
    warn: function() {
        for (var i = 0; i < arguments.length; i++) {
            loglevel.warn(moment().format(), '[WARN]', arguments[i]);
        }
    },
    error: function() {
        for (var i = 0; i < arguments.length; i++) {
            loglevel.error(moment().format(), '[ERROR]', arguments[i]);
        }
    }
};

var logger = new Logger();

/**
 * overwrite native console.log with Logger.info
 */

if (console.log) {
    console.log = function() {
        for (var i = 0; i < arguments.length; i++) {
            logger.info(arguments[i]);
        }
    }
};

//set log level from config
if(Config.get('loglevel') !== false) {
    logger.setLevel(Config.get('loglevel'));
} else {
    //set to error only
    logger.setLevel(4);
}

//overwrite log level if needed
if(typeof argv.loglevel !== 'undefined') {
    logger.setLevel(argv.loglevel);
}

module.exports = logger;
