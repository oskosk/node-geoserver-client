module.exports = geoserver;

function geoserver(baseUrl) {
  if (!(this instanceof geoserver)) {
    return new geoserver(baseUrl);
  }
  this.wms = require("./lib/wms")(baseUrl);
}