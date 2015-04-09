module.exports = {
  layers: function(options, fn) {
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    this
      .get('/layers')
      .query(options)
      .end(function(err, res) {
        if (err) return fn(err);
        if (res.error) return fn(new Error(res.error));
        fn(null, res.body);
      });

  },
  layer: function(id, options, fn) {
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    this
      .get('/layers/' + id)
      .query(options)
      .end(function(err, res) {
        if (err) return fn(err);
        if (res.error) return fn(new Error(res.error));
        fn(null, res.body);
      });

  }
}