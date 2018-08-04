var client = new Paho.MQTT.Client("spectacular-hairdresser.cloudmqtt.com", 443, "myclientid_" + parseInt(Math.random() * 100, 10));

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

var options = {
  useSSL: true,
  userName:'hkadwsqx', 
  password:'BCTi-JnC_3Hg',
  onSuccess:onConnect,
  onFailure:doFail,
  mqttVersion:4
}

$( document ).ready(function() {
  client.connect(options);
}) ;

google.load("visualization", "1", {packages:["corechart"]}) ;
 
// Revisar si está ingrsesado 
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  alert('GO!');
  client.subscribe("hwthon/oliberum");
  //client.subscribe("DK");
}
function doFail(e){
  console.log(e);
}
function clickButton(e){
  var valorInput = $("#input1").val();
  window.location.replace('oil.html');
  //alert(valorInput);
}


// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

var obj1 ;
// called when a message arrives
function onMessageArrived(message) {
  var msgTopic = message.destinationName.split('/')[0];
  var msgSubtopic = message.destinationName.split('/')[1];
  var msgJson = JSON.parse(message.payloadString);
  console.log(message.destinationName) ;

  console.log("json x2: "+message.payloadString) ; //+ ", subtopic:" + msgSubtopic + ", direction: " + msgJson.direction) ;

  obj1 = message.payloadString ;

  oliberum(obj1) ;//message.payloadString) ;  
  //drawChart(message.payloadString) ;
}

function oliberum(data) {
  var obj = JSON.parse(data) ;

  console.log("test >> "+data) ;
  console.log("test parser >> "+obj.oliberum_device) ; // level state
  init();

  //drawChart(obj.oliberum_device) ;
  //if(obj.oliberum_device == '1'){ console.log("succes") ;   
}


//Creates a new Messaging.Message Object and sends it to the HiveMQ MQTT Broker
var publish = function (payload, topic, qos) {
  var message = new Paho.MQTT.Message(payload);
  message.destinationName = topic;
  client.send(message);
}


function init (){
  // Load the Visualization API and the corechart package.
  google.charts.load('current', {'packages':['corechart']}) ;
  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart) ;        
}

function drawChart(){
  var obj2 = JSON.parse(obj1) ;
    
var data = new google.visualization.DataTable();
data.addColumn('string', 'Propiedad JSON');
data.addColumn('number', 'Valor');
data.addRows([
    ["Nivel", parseInt(obj2.oliberum_device)] //obj2.oliberum_device] //,     ["Tiempo", 15]
]
);

// Set chart options
var options = {'title':'Estado del recipiente',
               'width':400,
               'height':300,
               is3D:true};

// Instantiate and draw our chart, passing in some options.
var chart = new google.visualization.PieChart(document.getElementById("chart_div"));
chart.draw(data, options);
}

function update(){
  console.log("Testint objet1 = "+obj1) ;
  //var obj2 = oliberum() ;
  drawChart() ;
}
//Game control
//Monkeys Position
var m1=480 ;

//Banana Position
var b1=240 ;

//Team Score
var s1=0 ;

function move1(direction) {
  if(direction == '1'){
    if(m1>0){ 
      m1-=10;
      $("#monkey1").css("margin-top", m1);
      if(m1 === b1){
        s1+=100;
        $("#score1").text(s1);
        var randNum = Math.floor(Math.random()*480);
        b1 = randNum - (randNum%10);
        console.log(b1);
        $("#banana1").css("margin-top", b1);
      }
    }
  }
  else if(direction == '2'){
    if(m1<480){
      m1+=10;
      $("#monkey1").css("margin-top", m1);
      if(m1 === b1){
        s1+=100;
        $("#score1").text(s1);
        var randNum = Math.floor(Math.random()*480);
        b1 = randNum - (randNum%10);
        console.log(b1);
        $("#banana1").css("margin-top", b1);
      }
    }
  }
}


function moveDK() {
  mDK=bDK;
  $("#monkeyDK").css("margin-top", mDK);
  sDK+=100;
  $("#scoreDK").text(sDK);
  var randNu = Math.floor(Math.random()*480);
  bDK = randNu - (randNu%10);
  $("#bananaDK").css("margin-top", bDK);
  var audio = new Audio('assets/DK.mp3');
  audio.play();
}
