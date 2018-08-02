// Modulos
const express = require('express') ;
var app = express() ;
var morgan = require('morgan') ;
var logger = morgan('combined') ;

var bodyParser = require('body-parser') ; // Post
var cookieParser = require('cookie-parser');
const cors = require('cors');

const path = require('path') ;
const PORT = process.env.PORT || 5000  ;

// view engine setup
app.use(express.static(path.join(__dirname, ''))) ;
app.engine('html', require('ejs').renderFile) ;
app.set('view engine', 'html') ;

app.get('/', (req, res) => res.render('pages/index'))  ; // index.html
app.get('/data', (req, res) => res.render('pages/Data'))  ; // index.html


//Conexión con el Broker de MQTT
const mqtt = require('mqtt') ;
const mqttOptions = {host:'m12.cloudmqtt.com', port:'14689', username:'tvqnqekm', password:'waUp4soXGrIP'} ;
let client = mqtt.connect(mqttOptions);

//Inicialización del server que escucha las solicitudes HTTP
app.use(morgan('dev')) ;     // 'combined', 'default', 'short', 'tiny', 'dev'
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//CORS para permitir solicitudes de cualquier origen
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin');
  next();
});

//Escucha cuando el cliente MQTT se conecte
client.on('connect', () => { // When connected
  console.log('Connected')
  /*client.subscribe('move/#', () => {
  });*/
  client.subscribe('oliberum/#', () => {    
  });
  client.on('message', (topic, message, packet) => {
    console.log(topic);
    if(topic.split('/')[0] === 'oliberum'){          
      let msgJson = JSON.parse(message);
      console.log(topic) ;
      console.log(msgJson) ;
    }
  });
  // publish a message to a topic
  var msg = JSON.stringify({'mensaje':'Daniel Rocks!'}) ;
  client.publish('flag/rocks', msg, () => {
    console.log("Message is published");
      //client.end(); // Close the connection when published
  }) ;
})

// Ajax Request
function get(){
  $('button').click(function(){
    $.get({ //ajax
        url: 'https://iot-xyz.herokuapp.com/iot',
        dataType: 'json', // jsonp
        success: function (data) {
            $('div').html(JSON.stringify(data));        
        }
    });
  }) ;	       
}

// $.post( "test.php", { 'choices[]': [ "Jon", "Susan" ] } ) ;
// Ajax Request
function post(){
  $('button').click(function(){
    $.post("demo_post.asp",
    {
        name: "Daniel Chaves",
        city: "Cartago",
        proyecto: "Monitoreo y Concientizacion de residuos industriales",
        grupo: "__OLIBERUM__"
    }) ;
  }) ;
}

function drawChart(){
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Propiedad JSON');
	data.addColumn('number', 'Valor');
	data.addRows([
		["Superior", 1], //response.date **************
		["Tiempo", 15]]
	);
	// Set chart options
	var options = {'title':'Tiempo ww',
				   'width':400,
				   'height':300,
				   is3D:true};
	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
	chart.draw(data, options);
}

function notifyMe() {	  
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
  // If it's okay let's create a notification
    var notification = new Notification("Sientese bien mae");
  }
  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    // If the user accepts, let's create a notification
    Notification.requestPermission(
      function (permission){
        if (permission === "granted") {
          var notification = new Notification("Sientese bien");
        }
      }
    );
  }

}

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

