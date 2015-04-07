var url = "http://localhost:8080/geoserver",
  geoserver = require("..")(url, {
    user: "admin",
    password: "geoserver"
  });

geoserver.admin.style("tiger_roads", function(err, data) {
  if (err) {
    return console.log("error: %s", JSON.stringify(err));
  }
  console.log("Got style: ", JSON.stringify(data, false, 2));

});