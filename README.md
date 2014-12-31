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

##wms.serviceMetadata (wmsBaseUrl, [queryOptions], callback(err,serviceMetadata))

Gets service metadata reported in the capabilities under the `Service` key/tag as a javascript object

###Example
    
    var wmsUrl = "http://geocarto.igac.gov.co/geoservicios/wms";  
    geoserver.wms.serviceMetadata(wmsUrl, function(err, serviceMetadata) {
      console.log(serviceMetadata):
    });

#License

The MIT License (MIT)

Copyright (c) 2014-2015 Oscasr López <oskosk@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.