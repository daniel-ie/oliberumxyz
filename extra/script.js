var client = new Paho.MQTT.Client("spectacular-hairdresser.cloudmqtt.com", 443, "myclientid_" + parseInt(Math.random() * 100, 10));

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

var options = {
  useSSL: true,
  userName: 'hkadwsqx',
  password: 'BCTi-JnC_3Hg',
  onSuccess: onConnect,
  onFailure: doFail,
  mqttVersion: 4
}
var map;
var gjPoint = {
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [
        -84.14302110671997,
        9.936916018607898
      ]
    },
    "properties": {
      "title": "Tanque #1",
      "icon": "circle"
    }
  }]
}

$(document).ready(function () {
  initMap();
  client.connect(options);
});

//google.load('visualization', '1', {packages:['gauge']}) ; //"1", 
google.charts.load('visualization', { 'packages': ['gauge'] });


// Revisar si está ingrsesado 
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  ///alert('GO!');
  client.subscribe("hwthon/oliberum");
  //client.subscribe("DK");
}
function doFail(e) {
  console.log(e);
}
function clickButton() {
  //var valorInput = $("#button1").val();
  window.location.replace('oil.html');
  //alert(valorInput);
}
// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}


var obj1;
// called when a message arrives
function onMessageArrived(message) {
  var msgTopic = message.destinationName.split('/')[0];
  var msgSubtopic = message.destinationName.split('/')[1];
  var msgJson = JSON.parse(message.payloadString);
  console.log(message.destinationName);

  console.log("JSON data: " + message.payloadString); //+ ", subtopic:" + msgSubtopic + ", direction: " + msgJson.direction) ;

  obj1 = message.payloadString;

  oliberum(obj1);//message.payloadString) ;
  //recipienteListo(obj1);
  //drawChart(message.payloadString) ;
}

function oliberum(data) {
  var obj = JSON.parse(data) ;

  console.log("*** Var state = "+data) ; // obj.oliberum_device

  var range = parseInt(obj.oliberum_device) ;
  /* Handler Map */
  if (range >= 5) {
    gjPoint.features[0].properties.icon = 'monument';
    gjPoint.features[0].properties.title = 'Full';
    map.getSource("scPoint").setData(gjPoint);

    var popup = new mapboxgl.Popup({ closeOnClick: false }) 
      .setLngLat([
        -84.14302378892899,
        9.936937154378773
      ])
      .setHTML('<h4 style="text-align:center">Recipiente listo!</h4>')
      .addTo(map);
  }

  init();
   
}

//Creates a new Messaging.Message Object and sends it to the HiveMQ MQTT Broker
var publish = function (payload, topic, qos) {
  var message = new Paho.MQTT.Message(payload);
  message.destinationName = topic;
  client.send(message);
}

function init() {
  // Load the Visualization API and the corechart package.
  google.charts.load('current', { 'packages': ['corechart'] });
  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);
}

//-------------------------- Plot del gráfico --------------------------
function drawChart() {
  var obj2 = JSON.parse(obj1);

  var data = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Tank level', parseInt(obj2.oliberum_device)]
  ]);

  var options = {
    width: 400, height: 400,
    redFrom: 90, redTo: 100,
    yellowFrom: 75, yellowTo: 90,
    minorTicks: 5
  };
  var chart = new google.visualization.Gauge(document.getElementById('chart_div'));
  chart.draw(data, options);

}

function info() {
  var x = document.getElementById("myInfo");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
  //var valorInput = $("#input1").val();
  //window.location.replace('oil.html');
}

function initMap() {
  mapboxgl.accessToken = 'pk.eyJ1Ijoib3NhbWFwIiwiYSI6ImNqZTh4MG82MTA0NTQyd3FlOXE4ZmsweGQifQ.xT6nJZDWamOeIxKXklrNYQ';
  map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
    center: [
      -84.14305865764695, //18
      9.936894882835697 //47
    ],
    zoom: 18.3,
    pitch: 75,
    bearing: -18, //0.6,
  });


  map.on('load', function () {
    // Insert the layer beneath any symbol layer.
    var layers = map.getStyle().layers;

    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
        labelLayerId = layers[i].id;
        break;
      }
    }

    /* build */
    map.addLayer({
      'id': '3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 15,
      'paint': {
        'fill-extrusion-color': '#aaa',

        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        'fill-extrusion-height': [
          "interpolate", ["linear"], ["zoom"],
          15, 0,
          15.05, ["get", "height"]
        ],
        'fill-extrusion-base': [
          "interpolate", ["linear"], ["zoom"],
          15, 0,
          15.05, ["get", "min_height"]
        ],
        'fill-extrusion-opacity': .6
      }
    }, labelLayerId);



    /* POINT */
    map.addSource("scPoint", {
      type: "geojson",
      data: gjPoint
    });

    map.addLayer({
      "id": "points",
      "type": "symbol",
      "source": 'scPoint',
      "layout": {
        "icon-image": "{icon}-15",
        "text-field": "{title}",
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, 0.6],
        "text-anchor": "top"
      }
    });
  });
}
