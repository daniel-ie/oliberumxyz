// Modulos
const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
let app = express() ;

const path = require('path') ;
const PORT = process.env.PORT || 5000  ;
	
app.use(express.static(path.join(__dirname, ''))) ; 
app.set('views', path.join(__dirname, 'views')) ;
app.set('view engine', 'ejs') ;
app.get('/', (req, res) => res.render('pages/index'))  ; // index.html

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

