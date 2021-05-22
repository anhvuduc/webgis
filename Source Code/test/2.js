     var layers = [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
         new ol.layer.Image({
          extent: [-180, 180, -90, 90],
          source: new ol.source.ImageWMS({

            //Replace 'localhost' below with your server IP or hostname 
 
            url: 'http://localhost:8080/geoserver/foss4g/wms',  
            params: {'LAYERS': 'foss4g:tcroads'},
            ratio: 1,
            serverType: 'geoserver'
          })
        })
      ];

//layer3	  
	var newlayer = new ol.layer.Image ({
	source: new ol.source.ImageWMS ({
            url: 'http://localhost:8080/geoserver/foss4g/wms',  
            params: {'LAYERS': 'foss4g:tcbuildings'},
            ratio: 1,
            serverType: 'geoserver'
          })
        });	

//layer4
	var newlayer2 = new ol.layer.Image ({
	source: new ol.source.ImageWMS ({
            url: 'http://localhost:8080/geoserver/foss4g/wms',  
            params: {'LAYERS': 'foss4g:floodzones'},
            ratio: 1,
            serverType: 'geoserver',
            opacity: 0.5
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

    map.addLayer(newlayer2);

	  map.addLayer(newlayer);