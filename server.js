// Modulos

const express = require('express') ;
var app = express() ;
var bodyParser = require('body-parser') ; // Post
var cookieParser = require('cookie-parser');
const path = require('path') ;

const PORT = process.env.PORT || 5000  ;

//app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public'))) ; 
app.set('views', path.join(__dirname, 'views')) ;
app.set('view engine', 'ejs') ;
app.get('/', (req, res) => res.render('pages/index'))  ; // index.html
 
app.get('/index2', (req, res) => res.render('pages/index2'))  ; // index.html
 

function initializer(){
  $('button').click(function(){
    $.ajax({
        url: 'https://iot-xyz.herokuapp.com/iot',
        dataType: 'json', // jsonp
        success: function (data) {
            $('div').html(JSON.stringify(data));        
        }
    });
  }) ;	
        
}

/*function initializer(){
  $.ajax({
    type: "POST", //rest Type
    dataType: 'jsonp', //mispelled
    url: "https://iot-xyz.herokuapp.com/iot",
    async: false,
    contentType: "application/json; charset=utf-8",
    success: function (msg) {
        console.log(msg);                
    }
  });
}
*/

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
