var layers = [
  //base open street map
    new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
    ]; 
  
  // layer 1
    var layer1 = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: 'http://localhost:8080/geoserver/pj1/wms',  
        params: {'LAYERS': 'pj1:peninsularsea_and_neighbour'},
        ratio: 1,
        serverType: 'geoserver'
      })
    });
    layer1.setOpacity(0.5);

  //layer 2
    var layer2 = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: 'http://localhost:8080/geoserver/pj1/wms',  
        params: {'LAYERS': 'pj1:australia_state'},
        ratio: 1,
        serverType: 'geoserver'
      })
    });
    layer2.setOpacity(0.5);

  //layer 3
    var layer3 = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: 'http://localhost:8080/geoserver/pj1_2/wms',
        params: {'LAYERS': 'pj1_2:w_raster'},
        ratio: 1,
        serverType: 'geoserver'
      })
    });
    layer3.setOpacity(0.5);
  
  //view
    var map = new ol.Map({
      layers: layers,
      target: 'map',
      view: new ol.View({
        center: [0,0],
        zoom: 1
      })
    });
  map.addLayer(layer1);
  map.addLayer(layer2);
  map.addLayer(layer3);  

//function switch layer
  function switchlayer(thelayer) {
    var layer = {
      layer1: layer1,
      layer2: layer2,
      layer3: layer3,
    }
    [thelayer];
    layer.setVisible(!layer.getVisible())
    };

//  var viewparameters = document.getElementById('keyword').value;

  var cql = '';
  
//cqlfilter
var cqlfilter = new ol.layer.Image({
  source: new ol.source.ImageWMS({
    url: 'http://localhost:8080/geoserver/pj1/wms',
    params: {'LAYERS': 'pj1:tm_world_borders-0.3','CQL_FILTER': cql},
    serverType: 'geoserver',
  }),
});	
map.addLayer(cqlfilter);

//search function
  function search() {

    var formElement = document.querySelector("#formElement");
    formElement.addEventListener("submit", (e) => e.preventDefault());

    var value = document.querySelector("#keyword").value;
    cql = "name LIKE " + "'%" + value + "%'";
    cqlfilter.getSource().updateParams({'LAYERS': 'pj1:tm_world_borders-0.3','CQL_FILTER': cql});
    viewparameters = cql;
  };

  map.on('singleclick', function (evt) {
    document.getElementById('info').innerHTML = '';
    var viewResolution = /** @type {number} */ (view.getResolution());
    var url = layer1.getFeatureInfoUrl(
      evt.coordinate,
      viewResolution,
      'EPSG:4326',
      {'INFO_FORMAT': 'text/html'}
    );
    if (url) {
      fetch(url)
        .then(function (response) { return response.text(); })
        .then(function (html) {
          document.getElementById('info').innerHTML = html;
        });
    }
  });
  

