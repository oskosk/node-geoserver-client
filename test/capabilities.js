var url = "http://geocarto.igac.gov.co/geoservicios/wms",
  geoserver = require("..")(url);

geoserver.wms.capabilities(function(err, data) {
  if (err) {
    return console.log("Error: %j", err);
  }
  console.log(data);

});