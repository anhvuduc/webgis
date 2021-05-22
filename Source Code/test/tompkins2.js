// First, we set up our base layers...
 
var layers = [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    new ol.layer.Image({
      extent: [-13884991, 2870341, -7455066, 6338219],
      source: new ol.source.ImageWMS({

        //Replace 'localhost' below with your server IP or hostname 

        url: 'http://localhost:8080/geoserver/foss4g/wms',  
        params: {'LAYERS': 'foss4g:tcroads'},
        ratio: 1,
        serverType: 'geoserver'
      })
    })
  ];

var theurl = 'http://localhost:8080/geoserver/foss4g/wms';

//  add the parcels layer. All other wms layers will following this pattern, but with a twist	
var parcels = new ol.layer.Image({
      extent: [-13884991, 2870341, -7455066, 6338219],
      source: new ol.source.ImageWMS({

        //Replace 'localhost' below with your server IP or hostname 

        url: theurl,  
        params: {'LAYERS': 'foss4g:parcels'},
        ratio: 1,
        serverType: 'geoserver'
      })
    });		

 parcels.setOpacity(0.3);
 

 //import ImageWMS ;

var wmsSource = new ol.source.TileWMS({
url: theurl,
params: {'LAYERS': 'foss4g:parcels', 'TILED': true},
serverType: 'geoserver',
crossOrigin: 'anonymous'
});


 

//  add firestations layer
var firestations = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: theurl,
        params: {'LAYERS': 'foss4g:firestations'},
        serverType: 'geoserver'
      })
    });	



//  add floodzone layer
var floodzones = new ol.layer.Image({
      extent: [-13884991, 2870341, -7455066, 6338219],
      source: new ol.source.ImageWMS({

        //Replace 'localhost' below with your server IP or hostname 

        url: 'http://localhost:8080/geoserver/foss4g/wms',  
        params: {'LAYERS': 'foss4g:floodzones'},
        ratio: 1,
        serverType: 'geoserver'
      })
    });
    
// first step is to create an SQL View, and we'll access it here

var parcelnear = new ol.layer.Image({
       source: new ol.source.ImageWMS({
        url: theurl,
       params: {'LAYERS': 'foss4g:parcelfz', 'viewparams': viewparameters},
        serverType: 'geoserver'
      })
    });	
    
        // add the created layers to the map
        // (if you want custom layers to show up they must be here as well)
        
var map = new ol.Map({
        layers: layers,
        target: 'map',
        view: new ol.View({
        center: [-8512597,5231612],
        zoom: 10
                        })
        });

map.addLayer(parcels);	
map.addLayer(firestations);
//	map.addLayer(parcelnear);
map.addLayer(floodzones);

// here we will manipulate the parcels, but are going to play around with some filters to
// find parcels that are near a a flood zone, and in this case, we are going to get
// the parameters from the input box instead of a hard coded variable.

//  add parcel layer - in this case we will use an SQL View where we pass in the 
//  flood zone ('A', 'AE', or 'X500' and the distance (d) from the HTML form we create below.

var viewparameters = 'zonename:' + document.getElementById('floodzone').value + ';d:' + document.getElementById('distance').value;
//	alert(viewparameters);


//  CQL filters
//  add firestation layer - uses an example CQL.  But in this case, instead of hard coded values,
//  we'll grab it from the HTML form.

var cqlfilter = '';
//	var cqlfilter = 'DWITHIN (geom, POINT(360514  4698789),2000,meters)';
//	var cqlfilter = 'DWITHIN(geom, collectGeometries(queryCollection(\'foss4g:floodzones\',\'geom\',\'INCLUDE\')), 2000, meters)';
//	var cqlfilter = 'DWITHIN(geom, collectGeometries(queryCollection(\'foss4g:floodzones\',\'geom\',\'zone = \'\'AE\'\' \')), 15000, meters)' ;
//	var cqlfilter = 'DWITHIN(geom, collectGeometries(queryCollection(\'foss4g:floodzones\',\'geom\',\'zone = \'\'' + document.getElementById('floodzone').value + '\'\' \')), ' + document.getElementById('distance').value + ', meters)' ;
// alert(cqlfilter);

var firecql = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: theurl,
        params: {'LAYERS': 'foss4g:firestations','CQL_FILTER': cqlfilter},
        serverType: 'geoserver'
      })
    });	
map.addLayer(firecql);


//////////////////////////////////////////////
//SPECIAL FUNCTIONS

// This function takes the input from the HTML form and updates the filters 
// to select schools that are a certain distance from the selected factory.
// This is shown for both a CQL filter and an SQL View.

function findFlood() {
cqlfilter = 'DWITHIN(geom, collectGeometries(queryCollection(\'foss4g:floodzones\',\'geom\',\'zone = \'\'' + document.getElementById('floodzone').value + '\'\' \')), ' + document.getElementById('distance').value + ', meters)' ;
//	alert(cqlfilter);
firecql.getSource().updateParams({'LAYERS': 'foss4g:firestations','CQL_FILTER': cqlfilter});
viewparameters = 'zonename:' + document.getElementById('floodzone').value + ';d:' + document.getElementById('distance').value;
parcelnear.getSource().updateParams({'LAYERS': 'foss4g:parcelfz', 'viewparams': viewparameters});
}	  
    
//////////////////////////////////////////////

// We are going to extend the application to handle user input. In this case, if the user 
// clicks on the map, we fire off an event function.  This event will specifically 
// get the Feature Information on the firecql layer.  The results will get passed
// to the HTML element 'info', to display the attributes.
// based on: https://openlayers.org/en/latest/examples/getfeatureinfo-tile.html

map.on('singleclick', function(evt) {
var view = map.getView();
document.getElementById('info').innerHTML = '';
var viewResolution = /** @type {number} */ (view.getResolution());
var url = wmsSource.getFeatureInfoUrl(
evt.coordinate, viewResolution, 'EPSG:3857',
{'INFO_FORMAT': 'text/html'});
if (url) {
prompt('',url);
fetch(url)
  .then(function (response) { return response.text(); })
  .then(function (html) {
    document.getElementById('info').innerHTML = html;
  });
}
});

    
    
function switchlayer(thelayer) {
var layer = {
parcels: parcels,
floodzones: floodzones,
firestations: firestations
}
[thelayer];
layer.setVisible(!layer.getVisible())

}
     