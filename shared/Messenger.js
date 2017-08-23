"use strict";

var Logger = require('./logger');

class Messenger {
  constructor() {
    this.onMessage = {};
  }

  send(connection, message) {
    console.log("send", message);
    if (connection.writable) {
      message.type = message.constructor.name;
      try {
        message = JSON.stringify(message);
      } catch (e) {
        Logger.error("error stringifying message: " + e.message);
        return false;
      }

      Logger.info("sending message to connection " + connection.id +
        " with data: " + message);

      return connection.write(message);
    }

    return false;
  }

  receive(connection, message) {
    console.log("receive", message);
    for (var key in this.onMessage[message.type]) {
      this.onMessage[message.type][key](connection, message);
    }
  }

  on(event, name, clazz, callback) {
    console.log(clazz.name);
    switch (event) {
      case 'message':
      case 'onMessage':
      case 'onmessage':
        //laaaaaaaaaaazy
        if (typeof this.onMessage[clazz.name] === 'undefined') {
          this.onMessage[clazz.name] = {};
        }
        this.onMessage[clazz.name][name] = callback;
        break;
      default:
        console.log('Trying to register a callback on a non existing event');
        break;
    }
  }

  off(event, name, clazz) {
    switch (event) {
      case 'message':
      case 'onMessage':
      case 'onmessage':
        delete this.onMessage[clazz.name][name];
        break;
      default:
        console.log('Trying to remove a callback on a non existing event');
        break;
    }
  }
}

module.exports = Messenger;
