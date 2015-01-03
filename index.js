var debug = require("debug"),
  urljoin = require("url-join");
module.exports = geoserver;

function geoserver(baseUrl) {
  if (!(this instanceof geoserver)) {
    return new geoserver(baseUrl);
  }
  if (!baseUrl) {
    throw (new Error("A baseUrl for a running geoserver instance is mandatory"));
  }
  debug("geoserver-client instance created for %s", baseUrl);
  this.wms = require("./lib/wms")(urljoin(baseUrl, "wms"));
}