var debug = require("debug"),
  wmsclient = require("wms-client"),
  urljoin = require("url-join");
module.exports = geoserver;

function geoserver(baseUrl, options) {
  if (!(this instanceof geoserver)) {
    return new geoserver(baseUrl, options);
  }
  if (!baseUrl) {
    throw (new Error("A baseUrl for a running geoserver instance is mandatory"));
  }
  debug("geoserver-client instance created for %s", baseUrl);
  this.wms = wmsclient(urljoin(baseUrl, "wms"));
  this.admin = require("./lib/admin")(urljoin(baseUrl, "rest"), options, {});
}