request = require("superagent");
urijs = require("URIjs");
debug = require("debug")("geoserver-client:wms");
extend = require("extend");
xml2json = require("xml2json");

var wms = {
  /**
   * @param {String} url.
   * @param {Object} [Optional] queryOptions. Options passed as GET parameters
   * @param {Function} callback.
   */
  capabilities: function(url, queryOptions, callback) {
    if (typeof queryOptions == "function") {
      callback = queryOptions;
      queryOptions = {};
    }
    url = wms.capabilitiesUrl(url, queryOptions);
    debug("Fetching %s", url);
    request.get(url).type("xml").redirects(2).end(function(err, res) {
      if (err) {
        debug("Error getting capabilities: %j", err);
        return callback(err);
      }
      if (!res.text) {
        debug("Got empty response from WMS")
        var err = new Error("Empty response for WMS capabilities request");
        return callback(err);
      }
      var json = xml2json.toJson(res.text);
      json = JSON.parse(json);
      callback(err, json);
    });
  },
  /**
   * Gets the WMS service layers reported in the capabilities as an array
   */
  layers: function(url, queryOptions, callback) {
    if (typeof queryOptions == "function") {
      callback = queryOptions;
      queryOptions = {};
    }
    wms.capabilities(url, queryOptions, function(err, capabilities) {
      if (err) {
        debug("Error getting layers: %j", err);
        return callback(err);
      }
      callback(null, capabilities.WMS_Capabilities.Capability.Layer.Layer);
    });
  },
  serviceMetadata: function(url, queryOptions, callback) {
    if (typeof queryOptions == "function") {
      callback = queryOptions;
      queryOptions = {};
    }
    wms.capabilities(url, queryOptions, function(err, capabilities) {
      if (err) {
        debug("Error getting service metadata: %j", err);
        return callback(err);
      }
      callback(null, capabilities.WMS_Capabilities.Service);
    });
  },
  /**
   * Formats an URL to include specific GET parameters
   * required for a GETCAPABILITIES WMS method request
   */
  capabilitiesUrl: function(wmsBaseUrl, queryOptions) {
    queryOptions = extend({
      request: "getCapabilities",
      // Query 1.3.0 version of WMS by default
      // Every geoserver supports at last 1.3.0
      version: "1.3.0",
      service: "wms"
    }, queryOptions);
    var url = new urijs(wmsBaseUrl).query(queryOptions);
    return url.toString();
  }
};

module.exports = wms;