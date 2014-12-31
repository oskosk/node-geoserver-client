geoserver = require("../index");

geoserver.wms.capabilities("http://geocarto.igac.gov.co/geoservicios/wms", {
  version: "1.3.0"
}, function(err, data) {
  if (err) {
    return console.log("error: %j", err);
  }
  console.log(data);

});