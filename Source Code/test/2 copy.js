//layer3	  
map = new OpenLayers.Map('map', {
  projection: new OpenLayers.Projection("EPSG:3857")
});
var layers = new ol.layer.Image ({
	source: new ol.source.ImageWMS ({
            url: 'http://localhost:8080/geoserver/pj1/wms',  
            params: {'LAYERS':'pj1:NI.Merged.Victoria'},
            ratio: 1,
            serverType: 'geoserver'
          })
        });	


      var map = new ol.Map({
        layers: layers,
        target: 'map',
        view: new ol.View({
        center: [144,-36],
        zoom: 10
        })
      });

    map.addLayer(newlayer2);

	  map.addLayer(newlayer);