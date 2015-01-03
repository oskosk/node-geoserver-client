var url = "http://geocarto.igac.gov.co/geoservicios/",
  geoserver = require("..")(url);

geoserver.wms.layers(function(err, data) {
  if (err) {
    return console.log("error: %j", err);
  }
  console.log(data);

});