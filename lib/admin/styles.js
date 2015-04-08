var xml2js = require("xml2js");

module.exports = {
  styles: function(options, fn) {
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    this
      .get('/styles')
      .query(options)
      .end(function(err, res) {
        if (err) return fn(err);
        if (res.error) return fn(new Error(res.error));
        fn(null, res.body);
      });

  },
  style: function(id, options, fn) {
    if (options.sld) {
      return this.styleSld(id, options, fn);
    }
    debug("Getting style %s", id);
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    this
      .get('/styles/' + id)
      .query(options)
      .end(function(err, res) {
        if (err) return fn(err);
        if (res.error) return fn(new Error(res.error));
        fn(null, res.body);
      });

  },
  styleSld: function(id, options, fn) {
    debug("Getting SLD file for style %s", id);
    this
      .get('/styles/' + id + ".sld")
    // This response needs to be buffer in geoserver
    .buffer()
      .query(options)
      .end(function(err, res) {
        if (err) return fn(err);
        if (res.error) return fn(new Error(res.error));
        if (options.sldAsJson) {
          xml2js.parseString(res.text, function(err, json) {
            if (err) {
              fn(err);
            } else {
              fn(null, json);
            }
          })
        } else {
          fn(null, res.text);
        }
      });

  },
  rasterize: function(layerId, options, fn) {
    debug("Getting style for layer %s", layerId);
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    this
      .get('/sldservice/' + layerId + '/rasterize.sld')
      .buffer()
      .query(options)
      .end(function(err, res) {
        if (err) return fn(err);
        if (res.error) return fn(new Error(res.error));
        fn(null, res.text);
      });

  },
};