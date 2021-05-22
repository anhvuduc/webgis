     
      var layers = [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ];
      var map = new ol.Map({
        layers: layers,
        target: 'map',
        view: new ol.View({
          center: [-10997148, 4569099],
          zoom: 4
        })
      });