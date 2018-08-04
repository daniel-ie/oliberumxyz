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

app.get('/', (req, res) => res.render('/index'))  ;//pages/index // index.html
app.get('/oil', (req, res) => res.render('/oil'))  ;//pages/index // index.html
app.get('/data', (req, res) => res.render('pages/Data'))  ; // index.html
app.get('/info', (req, res) => res.render('/index'))  ;//pages/index   // index.html


////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
/////////// MQTT Control
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
//Conexión con el Broker de MQTT
const mqtt = require('mqtt') ;
const mqttOptions = {host:'spectacular-hairdresser.cloudmqtt.com', port:'1883', username:'hkadwsqx', password:'BCTi-JnC_3Hg'} ;
let client = mqtt.connect(mqttOptions);

//Inicialización del server que escucha las solicitudes HTTP
app.use(morgan('dev')) ;     // 'combined', 'default', 'short', 'tiny', 'dev'
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies


//CORS para permitir solicitudes de cualquier origen
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin');
  next();
});

// POST
app.post('/info', function(req, res) {
  res.send() ; // post info
  var jsonData = req.body ;
  console.log(JSON.stringify(req.body)); // JSON
}) ;

//Escucha cuando el cliente MQTT se conecte
client.on('connect', () => { // When connected
  console.log('Connected')
  /*client.subscribe('move/#', () => {
  });*/
  client.subscribe('hwthon/oliberum', () => {     //oliberum/#
  });
  client.on('message', (topic, message, packet) => {
    console.log(topic);
    if(topic.split('/')[1] === 'oliberum'){          
      let msgJson = JSON.parse(message);
      console.log(topic) ;
      console.log(msgJson) ;

      // logica
      //oliberum(message); // mejor del lado del script
    }
  });
  // publish a message to a topic
  var msg = JSON.stringify({'mensaje':'Oliberum Rocks!'}) ;
  client.publish('hwthon/oliberum', msg, () => {
    console.log("Message is published");
      //client.end(); // Close the connection when published
  }) ;
})






// Ajax Request
function get(){
  $('button').click(function(){
    $.get({ //ajax
        url: 'https://iot-xyz.herokuapp.com/iot', //https://iot-xyz.herokuapp.com/iot https://spectacular-hairdresser.cloudmqtt.co
        dataType: 'json', // jsonp
        success: function (data) {
            $('div').html(JSON.stringify(data));        
        }
    });
  }) ;	       
}
function post(){
  $("button").click(function(){ //$('#add-order').click(function(){    
    var order = {  
      grupo: $("#name").val() 
    } ;  
    $.post({
        url: '/info', //https://iot-xyz.herokuapp.com/iot',
        dataType: 'json', // jsonp
        data: order,
        success: function (newOrder) {
          var _order = "test" ;
          //var d = "<li>Appended text</li>" ;
          $('#orders').append(newOrder) ; //JSON.stringify(newOrder)) ;
          //$('div').html(JSON.stringify(data));        
        }
        //success: console.log('Posted') 
    }) ;
  }) ;
}

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

