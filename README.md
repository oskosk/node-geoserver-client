#node-geoserver-client

A client library for interacting with a Geoserver instance 


#Installation

    npm install geoserver-client

#Usage
    geoserverclient = require("geoserver-client");
  
    var url = "http://localhost:8080/geoserver/";
    var geoserver = geoserverclient(url);

    // Get WMS Service Title 
    geoserver.wms.capabilities(function(err, capabilities) {
      if (err) return console.log(err);
      console.log(capabilities.WMS_Capabilities.Service.Title)
    });

#API

## Initialization

###geoserverclient(geoserverBaseUrl)

Returns an instance of geoserver client for a specific URL. You can use
this object for calling the API's methods.

**geoserverBaseUrl** is the geoserver endpoint. For example:

`http://localhost:8080/geoserver`

####Usage

    var url = "http://localhost:8080/geoserver",
      geoserver = require("geoserver-client")(url);

## WMS related calls

This module exposes an instance of the [wms-client](https://www.npmjs.com/package/wms-client) module for WMS related calls.
You get the **wms-client** module's API under the `wms` key of the geoserver object 

When you create an instance geoserver client with 
    
    geoserver = require("geoserver-client")("http://yourgeoserver:8000/geoserver");

you get a `wms` property in this instance: `geoserver.wms`

**Available methods**. 


* `geoserver.wms.capabilities` ([queryOptions], callback(err,capabilities) )
* `geoserver.wms.layers` ([queryOptions], callback(err,layers))
* `geoserver.wms.serviceMetadata` ([queryOptions], callback(err,serviceMetadata))
* `geoserver.wms.supportedCrs` ([queryOptions], callback(err,supportedcrs))
* `geoserver.wms.getMap` ([queryOptions], callback(err, image))

*Please refer to
[wms-client API docs](https://www.npmjs.com/package/wms-client#api)* 
for better reference. There are useful examples there for each method.

#License

The MIT License (MIT)

Copyright (c) 2014-2015 Oscar López <oskosk@gmail.com>

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