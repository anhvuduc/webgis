var layers = [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
     new ol.layer.Image({
      extent: [-13884991, 2870341, -7455066, 6338219],
      source: new ol.source.ImageWMS({

        //server IP or hostname 

        url: 'http://localhost:8080/geoserver/foss4g/wms',  
        params: {'LAYERS': 'foss4g:tcroads'},
        ratio: 1,
        serverType: 'geoserver'
      })
    })
  ];

  var theurl = 'http://localhost:8080/geoserver/foss4g/wms';    

//parcel layer
var parcels = new ol.Image({
    extent: [-13884991, 2870341, -7455066, 6338219],
    source: new ol.ImageWMS ({
        url: theurl,
        params: {'LAYERS': 'foss4g:parcels'},
        ratio: 1,
        serverType: 'geoserver'

    })
});
parcels.setOpacity(0.3);

//firestations layer
var firestations = new ol.Image({
    source: new ol.ImageWMS ({
        url: theurl,
        params: {'LAYERS': 'foss4g:firestations'},
        serverType: 'geoserver'

    })
});

//floodzone layer
var floodzones = new ol.Image({
    extent: [-13884991, 2870341, -7455066, 6338219],
    source: new ol.ImageWMS ({
        url: theurl,
        params: {'LAYERS': 'foss4g:floodzones'},
        ratio: 1,
        serverType: 'geoserver'

    })
});

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
map.addLayer(floodzones);

var viewparameters = 'zonename:' + document.getElementById('floodzone').value + ';d:' + document.getElementById('distance').value;

var cqlfilter = 'DWITHIN(geom, collectGeometries(queryCollection(\'foss4g:floodzones\',\'geom\',\'zone = \'\'' + document.getElementById('floodzone').value + '\'\' \')), ' + document.getElementById('distance').value + ', meters)' ;

var firecql = new ol.layer.Image({
    source: new ol.source.ImageWMS({
      url: theurl,
      params: {'LAYERS': 'foss4g:firestations','CQL_FILTER': cqlfilter},
      serverType: 'geoserver'
    })
  });	
  
var parcelcql = new ol.layer.Image({
    source: new ol.source.ImageWMS({
      url: theurl,
      params: {'LAYERS': 'foss4g:parcels','CQL_FILTER': cqlfilter},
      serverType: 'geoserver'
    })
  });	
  map.addLayer(firecql);
