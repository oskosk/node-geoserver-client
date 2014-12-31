geoserver = require("../index");

geoserver.wms.serviceMetadata("http://geocarto.igac.gov.co/geoservicios/wms",
  function(err, serviceMetadata) {
    if (err) {
      return console.log("error: %j", err);
    }
  console.log(serviceMetadata);

  });