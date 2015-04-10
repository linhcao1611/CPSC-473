var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var redis = require('redis');
var client = redis.createClient();

var app = express();
var topTen;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


client.on('connect', function () {
    console.log('redis connected');
});


app.post('/', function(req,res){
    var url, shortUrl;

    // get url 
    url = req.body.url;

    // get top ten shortUrl
    client.zrevrange("clicks", 0, 9, function(err, list){
                topTen=list;
                console.log(topTen);
    });

    // create a shortUrl
    shortUrl ="localhost:3000/"+ Math.random().toString(36).substr(2,5);

    //check if the url is in the database
    client.get(url, function(err, reply){
        if(reply === null && url.substring(0,14) === "localhost:3000"){
            // user enter an incorrect short url
            console("incorrect short url");
        } else if (reply === null){
            // save into Redis
            client.set(shortUrl,url);
            client.set(url, shortUrl, function(){
                res.render('output',{shortUrl: shortUrl, longUrl: url, list: topTen});
            });

            console.log(url);
            console.log(shortUrl);
        } else if(reply.substring(0,14) === "localhost:3000"){
            // the url already stored in the database, show the shortUrl that already stored
            res.render('output',{shortUrl:reply, longUrl:url, list:topTen});
            
        }else{ // user enter a short url, redirect to original page
            //console.log("short");
            res.redirect("http://"+reply);
        }

    });

    
});


app.get('/:url', function(req,res){
    var shortUrl;

    shortUrl="localhost:3000/"+req.params.url;
    console.log(shortUrl);


    client.get(shortUrl, function(err, reply){
        //console.log(reply);
        if(reply === null){
            console.log("error");
        }
        else{
            // increase clicks evertime shortUrl is used
            client.zincrby("clicks",1,shortUrl);
            res.redirect("http://"+reply);
        }
    });

});


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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
