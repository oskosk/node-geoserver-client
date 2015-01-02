var url = "http://geocarto.igac.gov.co/geoservicios/wms",
  geoserver = require("..")(url);

geoserver.wms.serviceMetadata(function(err, serviceMetadata) {
  if (err) {
    return console.log("error: %j", err);
  }
  console.log(serviceMetadata);
});