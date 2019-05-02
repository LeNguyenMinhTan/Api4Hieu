const express = require('express');
const app = express();
const morgan = require('morgan');
const mongo = require('./db');
const cors = require('cors'); //Access-Control-Allow-Origin asset domain default
const userRoutes = require('./api/routes/user')
const bodyParser = require('body-parser');
app.use(cors()); // https://www.npmjs.com/package/cors about info
const newsRoutes = require('./api/routes/news');

// app.use(express.static(__dirname + '/public'));

// app.get('/', function(req, res) {
//   res.sendfile('index.html');
// });



app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/users',userRoutes);
app.use('/news',newsRoutes);



app.use((req,res,next)=>{
  const error =new Error('Not Found');
  error.status=404;
  next(error);
});

app.use((error,req,res,next)=>{
  res.status(error.status || 500);
  res.json({
      error:{
          message: error.message
      }
  });
});



module.exports = app;