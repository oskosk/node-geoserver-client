var url = "http://geocarto.igac.gov.co/geoservicios/wms",
  geoserverclient = require(".."),
  geoserver = geoserverclient(url);

geoserver.wms.capabilities(function(err, capabilities) {
  if (err) return console.log(err);
  console.log(capabilities.WMS_Capabilities.Service.Title)
});