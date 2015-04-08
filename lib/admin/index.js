var debug = require("debug")("geoserver-client:admin"),
  extend = require("extend");

request = require("superagent");


module.exports = admin;

function admin(geoserverRestBaseUrl, options, otheroptions) {
  options = options || {};
  if (!(this instanceof admin)) {
    return new admin(geoserverRestBaseUrl, options, otheroptions);
  }

  this.url = geoserverRestBaseUrl;
  this.useragent = options.useragent || "node-geoserver-client";
  this.user = options.user;
  this.password = options.password;

  extend(this, require("./layers"));
  extend(this, require("./styles"));
}

admin.prototype = {


  get: function(path) {
    return this.request("get", path);
  },
  request: function(method, path) {
    var user = this.user;
    var pass = this.password;

    var url = this.url + path;
    debug('%s %s', method, url);

    var req = request[method](url);
    req.set('User-Agent', this.useragent);
    req.set('Accept', "application/json");

    // basic auth
    if (user && pass) {
      req.auth(user, pass);
      return req;
    }

    // auth token
    if (this.token) {
      req.set('Authorization', 'Bearer ' + this.token);
      return req;
    }

    throw new Error('basic auth credentials or auth token');
  }

}