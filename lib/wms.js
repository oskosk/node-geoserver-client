request = require("superagent");
urijs = require("URIjs");
debug = require("debug")("geoserver-client:wms");
extend = require("extend");
xml2json = require("xml2json");

/**
 * @param {String} baseURL. WMS service base URL. This URL is used in subsequent
 *   calls to wms() methods.
 * @returns {Object} wms object
 */
function wms(baseUrl) {
  if (!(this instanceof wms)) {
    return new wms(baseUrl);
  }
  this.baseUrl = baseUrl;
}

wms.prototype = {
  baseUrl: "",
  // Default version used in WMS GET requests
  // Every geoserver supports at last 1.3.0
  version: "1.3.0",
  /**
   * @param {Object} [Optional] queryOptions. Options passed as GET parameters
   * @param {Function} callback.
   *   - {Error} null if nothing bad happened
   *   - {Object} WMS Capabilities as Plain Object
   */
  capabilities: function(queryOptions, callback) {
    var url;
    if (typeof queryOptions == "function") {
      callback = queryOptions;
      queryOptions = {};
    }
    url = this.capabilitiesUrl(this.baseUrl, queryOptions);
    debug("Fetching %s", url);
    request.get(url).type("xml").end(function(err, res) {
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
   *
   * @param {Object} [Optional] queryOptions. Options passed as GET parameters
   * @param {Function} callback.
   *   - {Error} null if nothing bad happened
   *   - {Array} WMS layers as an array Plain Objects
   */
  layers: function(queryOptions, callback) {
    var url = this.baseUrl;
    if (typeof queryOptions === "function") {
      callback = queryOptions;
      queryOptions = {};
    }
    this.capabilities(queryOptions, function(err, capabilities) {
      if (err) {
        debug("Error getting layers: %j", err);
        return callback(err);
      }
      callback(null, capabilities.WMS_Capabilities.Capability.Layer.Layer);
    });
  },
  /**
   * Gets the WMS service metadata reported in the capabilities as a plain object
   *
   * @param {Object} [Optional] queryOptions. Options passed as GET parameters
   * @param {Function} callback.
   *   - {Error} null if nothing bad happened
   *   - {Array} WMS Service metadata as a Plain Object
   */
  serviceMetadata: function(queryOptions, callback) {
    var url = this.baseUrl;
    if (typeof queryOptions == "function") {
      callback = queryOptions;
      queryOptions = {};
    }
    this.capabilities(queryOptions, function(err, capabilities) {
      if (err) {
        debug("Error getting service metadata: %j", err);
        return callback(err);
      }
      callback(null, capabilities.WMS_Capabilities.Service);
    });
  },
  /**
   * Gets an image for a layer from a WMS service
   *
   * @param {Object} [Optional] queryOptions. Options passed as GET parameters
   * @param {Function} callback.
   *   - {Error} null if nothing bad happened
   *   - {Array} WMS layers as an array Plain Objects
   * @returns {Stream} you can use it to pipe to a file.
   */
  getMap: function(queryOptions, callback) {
    var url = this.getMapUrl(this.baseUrl, queryOptions);
    debug("Fetching %s", url);
    var stream = request.get(url, queryOptions);
    stream.end(function(err, res) {
      if (err) {
        debug("Error requesting getMap to server: %j", err);
        return callback(err);
      }
      if (!res.ok) {
        debug("WMS error response %s", res.text);
        var err = new Error(res.text);
        return callback(err);
      }
      // if (res.text) {
      //   var json = xml2json.toJson(res.text);
      //   json = JSON.parse(json);
      //   debug(json);
      // }
      if (typeof callback === "function") {
        callback(err, res.text);
      }
    });
    return stream;
  },
  /**
   * @param {String} WMS opeation (GetMap, GetCapabilities, etc)
   * @param {Object} WMS request parameters
   * @param {Function} callback
   *   - {Error} null if nothing bad happened
   *   - {json|Bufer} response from the server
   *
   */
  wmsrequest: function(operation, parameters, callback) {
    parameters.request = operation;
    request.get(this.baseUrl, parameters).end(function(err, res) {
      if (err) {
        debug("Error requesting %s to WMS service: %j", operation, err);
        return callback(err);
      }
      // superagent set res.error for 4xx and 5xx HTTP errors
      if (res.error) {
        debug("HTTP error response %s", res.error.message);
        var err = new Error(res.error.message);
        return callback(err);
      }
      if (typeof callback === "function") {
        callback(err, res.text);
      }
    });
    return request;
  },
  /**
   * Formats an URL to include specific GET parameters
   * required for a GETCAPABILITIES WMS method request
   */
  capabilitiesUrl: function(wmsBaseUrl, queryOptions) {
    queryOptions = extend({
      request: "getCapabilities",
      // Every geoserver supports at last 1.3.0
      version: this.version,
      service: "wms"
    }, queryOptions);
    var url = new urijs(wmsBaseUrl).query(queryOptions);
    return url.toString();
  },
  /**
   * Formats an URL to include specific GET parameters
   * required for a GetMap WMS method request
   */
  getMapUrl: function(wmsBaseUrl, queryOptions) {
    var bbox = this.extentToBbox(queryOptions.minx,
      queryOptions.miny,
      queryOptions.maxx,
      queryOptions.maxy);
    delete queryOptions.minx;
    delete queryOptions.miny;
    delete queryOptions.maxx;
    delete queryOptions.maxy;
    queryOptions = extend({
      request: "getMap",
      version: this.version,
      service: "wms",
      format: "image/png",
      styles: "",
      width: "256",
      height: "256",
      bbox: bbox
    }, queryOptions);
    var url = new urijs(wmsBaseUrl).query(queryOptions);
    return url.toString();
  },
  extentToBbox: function(minx, miny, maxx, maxy) {
    var bbox = "";
    if (this.version === "1.3.0") {
      bbox = [minx, miny, maxx, maxy].join(",");
    }
    return bbox;
  }
};

module.exports = wms;