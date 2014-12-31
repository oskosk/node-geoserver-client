#node-geoserver-client

A client library for interacting with a Geoserver instance 


#Installation

    npm install geoserver-client

#Usage

    var geoserver = require("geoserver-client");

    var url = "http://geocarto.igac.gov.co/geoservicios/wms";
    geoserver.capabilities(url, function(err, capabilities) {
      if (err) return console.log(err);
      console.log(capabilities.WMS_Capabilities.Service.Title)
    });

#API

##wms.capabilities (wmsBaseUrl, [queryOptions], callback(err,capabilities) )

Gets the capabilities reported by the WMS as a javascript object


###Example
    
    var wmsUrl = "http://geocarto.igac.gov.co/geoservicios/wms";  
    geoserver.wms.capabilities(wmsUrl, function(err, capabilities) {
      console.log(capabilities):
    });

##wms.layers (wmsBaseUrl, [queryOptions], callback(err,layers))

Gets layers reported in the capabilities by the WMS as a javascript array

###Example
    
    var wmsUrl = "http://geocarto.igac.gov.co/geoservicios/wms";  
    geoserver.wms.layers(wmsUrl, function(err, layers) {
      console.log(layers):
    });