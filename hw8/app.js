var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/url-shortener');
var Schema = mongoose.Schema;

var UrlSchema = new Schema({
  shortUrl: String,
  longUrl: String,
  clicks: Number
});

var UrlModel = mongoose.model('UrlSchema', UrlSchema);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.get('/url', function(req,res){
  UrlModel.find({}, function(err, result){
    res.json(result);
  });
});

function topTen(){
  return UrlModel.find({},{_id:0}).sort({clicks:1}).limit(10);
}

app.post('/', function(req,res){
  var inputUrl, sUrl;
  inputUrl = req.body.url;

  // check what is the type of input url
  // if it a short url
  if(inputUrl.substring(0,14) === "localhost:3000"){
    // check if it's in the database or not
    UrlModel.findOne({shortUrl: inputUrl}, function(err, result){
      if(err){
        console.log(err);
      } 
      if(result === null){ // not thing found
        console.log("invalid short url")
      } else{
        console.log("already in the database");
        result.clicks += 1;
        console.log(result);
        result.save(function(err){
          if(err){
            console.log(err);
          }else{
            console.log("updated clicks");
          }
        })
        if(result.longUrl.substring(0,7) === "http://"){
          res.redirect("http://"+result.longUrl.substring(7));
          //console.log(result.longUrl.substring(7));
        } else if(result.longUrl.substring(0,8) === "https://"){
          res.redirect("http://"+result.longUrl.substring(8));
        } else{
          res.redirect("http://"+result.longUrl);
        }
      }
    });
  } else{ // user enter a long url
    //check if that url is already in the database or not
    UrlModel.findOne({longUrl: inputUrl}, function(err, result){
      if(err){
        console.log(err);
      }
      if( result === null){// this url is not in the database
        // create a shortUrl
        var sUrl ="localhost:3000/"+ Math.random().toString(36).substr(2,5);
        // create a temp variable contain url data
        var temp = new UrlModel({
          shortUrl: sUrl,
          longUrl: inputUrl,
          clicks: 0
        });
        
        // save the url into database
        temp.save(function(err){
          if(err){
            console.log(err);
          } else {
            res.render('output',{shortUrl: result.shortUrl, longUrl: result.longUrl, list: topTen()})
            console.log("created");
          }
        });

      } else{ // this long url is already in the database
        console.log("this url is already in the database");
        // display it shortener url
        var listUrl = topTen();
        console.log(listUrl);
        res.render('output',{shortUrl: result.shortUrl, longUrl: result.longUrl, list: listUrl})

      } 

    });
    

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
