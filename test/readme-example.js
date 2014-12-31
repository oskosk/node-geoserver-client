var geoserver = require("..");

geoserver.wms.capabilities("http://geocarto.igac.gov.co/geoservicios/wms",
  function(err, capabilities) {
    if (err) return console.log(err);

    console.log("WMS Title: ", capabilities.WMS_Capabilities.Service.Title)
  });