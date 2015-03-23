var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

var app = express();
//var listQ = [
//    ["1", "How to use express?",  ["1. google it", "2. ask your friend", "3. ask your teacher", "4. buy a book"]],
//    ["2", "What's Nodejs?",  ["Node.js® is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications."]],
//    ["3", "Shoud you use Middleware in your Project?", []] 
//];

var listQ=[];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//to deal with data
//app.locals.appdata = require('./data.json');
app.locals.appdata = listQ;

//app.use('/', routes);
app.get('/', function(req,res){
  res.render('index',{ title: 'CPSC 473 Project' });

});

function returnIndex(inVal){
  for(var i=0;i<listQ.length;i++){
    if(listQ[i][0] === inVal){
      return i;
    }
  }
}

var timeoutID;
function checkAndDelete(){
  timeoutID =  setInterval(function(){
    for(var i=0; i<listQ.length;i++){
      console.log(listQ[i]);
      if(listQ[i][1] === 0){
        listQ.splice(i,1);
      } else {
        listQ[i][1] = listQ[i][1] - 1000;
      }
    }
  },1000);
}

function stopFunction(){
  clearTimeout(timeoutID);
}

// add a new question
app.post('/addQ', function(req,res){
  var newItem = req.body.newQ;
  var newTime = req.body.Stime*60000;
  var d = new Date();
  var n = d.getTime().toString();

  listQ.push([n, newTime, newItem ]); 
  res.redirect('/');
  var index = returnIndex(n);
  stopFunction();
  checkAndDelete();
  console.log(listQ.length);
  console.log(n);
  console.log(index);

  for(var j=0;j<listQ.length;j++)  {
    console.log(listQ[j]);
  }

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




module.exports = app;
//module.exports = checktime;
