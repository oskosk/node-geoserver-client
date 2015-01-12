var Client = require('node-rest-client').Client,
  debug = require("debug")("geoserver-client:admin"),
  extend = require("extend"),
  isHttpErrorStatus = require("./is-http-error-status"),
  urljoin = require("url-join");

module.exports = GeoserverAdminClient;


function GeoserverAdminClient(restApiBaseUrl, options, requestOptions) {
  if (!(this instanceof GeoserverAdminClient)) {
    return new GeoserverAdminClient(restApiBaseUrl, options, requestOptions);
  }
  var _this = this;
  // Client class defaults
  _this.options = extend({}, {
    url: restApiBaseUrl
  }, options);
  // request defaults
  // Don't care about any other format than JSON
  // Content-type is only used on POST, PUT and DELETE requests
  _this.requestOptions = extend({}, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  _this.responseFormatExtension = "json";
  debug("Creating Geoserver REST Admin API client with options: %j", _this.options);
  _this.client = new Client(_this.options);

}



GeoserverAdminClient.prototype = {
  // /workspaces[.<format>] GET

  workspaces: function(callback) {
    var _this = this,
      url = urljoin(_this.options.url, "/workspaces." + _this.responseFormatExtension);
    _this.client.get(url, function(data, response) {
      var err = isHttpErrorStatus(response.statusCode, 200);
      if (err) {
        return callback(new Error(err));
      }
      callback(null, data.workspaces.workspace);
    });
  },

  // /workspaces[.<format>] - POST
  createWorkspace: function(workspace, options, callback) {
    var _this = this,
      url = _this.options.url + "/workspaces" + _this.responseFormatExtension;
    options = extend({}, _this.requestOptions, options, {
      data: {
        workspace: {
          name: workspace
        }
      }
    });

    _this.client.post(url, options, function(data, response) {
      assertHttpStatus(201, response.statusCode) && callback(data);
    });
  },
  // /workspaces/<ws>[.<format>] - GET 
  workspace: function(workspace, callback) {
    var _this = this,
      url = _this.options.url + "/workspaces/" + workspace + "." + _this.responseFormatExtension;

    _this.client.get(url, function(data, response) {
      assertHttpStatus(200, response.statusCode) && callback(data);
    });
  },
  // /workspaces/<ws>[.<format>] - DELETE 
  deleteWorkspace: function(workspace, callback) {
    var _this = this,
      url = _this.options.url + "/workspaces/" + workspace + "." + _this.responseFormatExtension;

    _this.client.delete(url, function(data, response) {
      assertHttpStatus(200, response.statusCode) && callback(data);
    });
  },
  // /workspaces/<ws>[.<format>] - PUT 
  modifyWorkspace: function(workspace, workspaceData, callback) {
    var _this = this,
      url = _this.options.url + "/workspaces/" + workspace + "." + _this.responseFormatExtension;
    var options = extend({}, _this.requestOptions);
    options.data = {
      workspace: workspaceData
    };
    _this.client.put(url, options, function(data, response) {
      assertHttpStatus(200, response.statusCode) && callback(data);
    });
  },

  // /workspaces/default[.<format>] - GET
  defaultWorkspace: function(callback) {
    var _this = this,
      url = _this.options.url + "/workspaces/default." + _this.responseFormatExtension;

    _this.client.get(url, function(data, response) {
      assertHttpStatus(200, response.statusCode) && callback(data);
    });
  },
  // /workspaces/default[.<format>] - PUT
  setDefaultWorkspace: function(workspace, callback) {
    var _this = this,
      url = _this.options.url + "/workspaces/default." + _this.responseFormatExtension;
    var options = extend({}, _this.requestOptions, {
      data: {
        workspace: {
          name: workspace
        }
      }
    });

    _this.client.put(url, options, function(data, response) {
      assertHttpStatus(200, response.statusCode) && callback(data);
    });
  },


  // /workspaces/<ws>/datastores[.<format>]  - GET
  datastores: function(workspace, callback) {
    var _this = this,
      url = _this.options.url + "/workspaces/" + workspace + "/datastores." + _this.responseFormatExtension;
    var options = extend({}, _this.requestOptions);
    _this.client.get(url, options, function(data, response) {
      var err = isHttpErrorStatus(response.statusCode, 200);
      if (err) {
        return callback(new Error(err));
      }
      if (!data.dataStores) {
        data = [];
        callback(null, data);
      }
    });
  },
  // /workspaces/<ws>/datastores[.<format>] - POST
  createDatastore: function(datastore, workspace, config, callback) {
    var _this = this,
      url = _this.options.url + "/workspaces/" + workspace + "/datastores." + _this.responseFormatExtension;
    var options = extend({}, _this.requestOptions, {
      data: {
        dataStore: config
      }
    });
    _this.client.post(url, options, function(data, response) {
      assertHttpStatus(201, response.statusCode) && callback(data, response);
    });
  },
  // /workspaces/<ws>/datastores/<ds>[.<format>] - GET
  datastore: function(datastore, workspace, callback) {
    var _this = this,
      url = _this.options.url + "/workspaces/" + workspace + "/datastores/" + datastore + "." + _this.responseFormatExtension;
    var options = extend({}, _this.requestOptions, options);

    _this.client.get(url, options, function(data, response) {
      assertHttpStatus(200, response.statusCode) && callback(data);
    });
  },
  // /workspaces/<ws>/datastores/<ds>[.<format>] - DELETE
  deleteDatastore: function(datastore, workspace, recurse, callback) {

    var _this = this,
      url = _this.options.url + "/workspaces/" + workspace + "/datastores/" + datastore + "." + _this.responseFormatExtension;
    var options = extend({
      parameters: {
        // recurse may arrive `undefined` to this point
        recurse: recurse ? true : false
      }
    }, _this.requestOptions);

    _this.client.delete(url, options, function(data, response) {
      assertHttpStatus(200, response.statusCode) && callback(data);
    });
  },
  // /workspaces/<ws>[.<format>] - PUT 
  uploadShapefile: function(filePath, datastore, workspace, callback) {
    var _this = this,
      url = _this.options.url + "/workspaces/" + workspace + "/datastores/" + datastore + '/' + "file.shp";
    var fs = require('fs');

    fs.readFile(filePath, "binary", function(err, data) {
      if (err) {
        return console.log(err);
      }
      var options = extend({}, {
        headers: {
          "Content-type": "application/zip"
        }
      });
      options.data = data;
      //console.log(options.data.length);

      _this.client.put(url, options, function(data, response) {

        assertHttpStatus(200, response.statusCode) && callback(data, response);
      });
    });

  },
  // /workspaces/<ws>/datastores/<ds>/file[.<extension>]

  // /workspaces/<ws>/datastores/<ds>/featuretypes[.<format>]
  // /workspaces/<ws>/datastores/<ds>/featuretypes/<ft>[.<format>]
  // featureTypes: function(options) {

  // },
  // // /workspaces/<ws>/coveragestores[.<format>]
  // // /workspaces/<ws>/coveragestores/<cs>[.<format>]
  // // /workspaces/<ws>/coveragestores/<cs>/file[.<extension>]
  // coverageStores: function(options) {

  // },

  // // /workspaces/<ws>/coveragestores/<cs>/coverages[.<format>]
  // // /workspaces/<ws>/coveragestores/<cs>/coverages/<c>[.<format>]
  // coverages: function(options) {

  // },
  // // /styles[.<format>]
  // // /styles/<s>[.<format>]
  // styles: function(options) {

  // },
  // // /layers[.<format>]
  // // /layers/<l>[.<format>]
  // // /layers/<l>/styles[.<format>]
  // layers: function(options) {

  // },
  // // /layergroups[.<format>]
  // // /layergroups/<lg>[.<format>]
  // layerGroups: function(options) {

  // }

};

function assertHttpStatus(expectedStatusCode, statusCode) {
  if (statusCode === 400) {
    console.error("HTTP response Status Code: 400 Bad Request");
  } else if (statusCode === 403) {
    console.error("HTTP response Status Code: 403 Forbidden");
  } else if (statusCode === 404) {
    console.error("HTTP response Status Code: 404 Not Found");
  } else if (statusCode === 405) {
    console.error("HTTP response Status Code: 405 Method Not Allowed");
  } else if (statusCode === 500) {
    console.error("HTTP response Status Code: 500 Internal Server Error");
  } else if (statusCode !== expectedStatusCode) {
    console.error("HTTP response Status Code: " + statusCode);
    return false;
  } else {
    return true;

  }

}