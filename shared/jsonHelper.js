"use strict";

function JsonHelper() {

}

JsonHelper.prototype = {

  strMapToJson: function(strMap) {
    return JSON.stringify(this.strMapToObj(strMap));
  },

  jsonToStrMap: function(jsonStr) {
    return this.objToStrMap(JSON.parse(jsonStr));
  },

  strMapToObj: function(strMap) {
    let obj = Object.create(null);
    for (let [k, v] of strMap) {
      // We don’t escape the key '__proto__'
      // which can cause problems on older engines
      obj[k] = v;
    }
    return obj;
  },

  objToStrMap: function(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
  }
}

module.exports = new JsonHelper();
