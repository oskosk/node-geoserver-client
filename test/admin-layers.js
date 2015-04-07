var url = "http://localhost:8080/geoserver",
  geoserver = require("..")(url, {
    user: "admin",
    password: "geoserver"
  });

geoserver.admin.layers(function(err, data) {
  if (err) {
    return console.log("error: %s", JSON.stringify(err));
  }
  console.log("Got layers: ", JSON.stringify(data, false, 2));

});