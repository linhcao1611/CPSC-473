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
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);




app.post('/', function(req, res) {
    var inputUrl;
    var topTenUrl = [];
    inputUrl = req.body.url;

    // check what is the type of input url
    // if it a short url
    if (inputUrl.substring(0, 14) === "localhost:3000") {
        // check if it's in the database or not
        UrlModel.findOne({
            shortUrl: inputUrl
        }, function(err, result) {
            if (err) {
                console.log(err);
            }
            if (result === null) { // not thing found
                console.log("invalid short url");
            } else {
                console.log("already in the database");
                result.clicks += 1;
                console.log(result.longUrl);
                result.save(function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("updated clicks");
                    }
                });

                // calculate top ten url and render the page
                UrlModel.find({}, function(err, list) {
                    var index;
                    for (index = 0; index < list.length; index++) {
                        //console.log(list[index].shortUrl);
                        //topTenUrl[index] = list[index].shortUrl;
                        topTenUrl.push(list[index].shortUrl);
                        //console.log("top ten inside call back function");
                        //console.log(topTenUrl);
                    }
                    res.render('output', {
                        shortUrl: inputUrl,
                        longUrl: result.longUrl,
                        list: topTenUrl
                    });
                }).sort({
                    clicks: -1
                }).limit(10);



                //if (result.longUrl.substring(0, 7) === "http://") {
                //    res.redirect("http://" + result.longUrl.substring(7));
                //console.log(result.longUrl.substring(7));
                //} else if (result.longUrl.substring(0, 8) === "https://") {
                //    res.redirect("http://" + result.longUrl.substring(8));
                //} else {
                //    res.redirect("http://" + result.longUrl);
                //}
            }
        });
    } else { // user enter a long url
        var listUrl;
        //check if that url is already in the database or not
        UrlModel.findOne({
            longUrl: inputUrl
        }, function(err, result) {
            if (err) {
                console.log(err);
            }
            if (result === null) { // this url is not in the database
                // create a shortUrl
                var sUrl = "localhost:3000/" + Math.random().toString(36).substr(2, 5);
                // create a temp variable contain url data
                var temp = new UrlModel({
                    shortUrl: sUrl,
                    longUrl: inputUrl,
                    clicks: 0
                });



                // save the url into database
                temp.save(function(err) {
                    if (err !== null) {
                        console.log(err);
                    } else {
                        UrlModel.find({}, {
                            shortUrl: 1,
                            _id: 0
                        }, function(err, result) {
                            console.log(result.shortUrl);
                            listUrl = result;
                        });

                        // calculate top ten url and render the page
                        UrlModel.find({}, function(err, list) {
                            var index;
                            for (index = 0; index < list.length; index++) {
                                //console.log(list[index].shortUrl);
                                //topTenUrl[index] = list[index].shortUrl;
                                topTenUrl.push(list[index].shortUrl);
                                //console.log("top ten inside call back function");
                                //console.log(topTenUrl);
                            }
                            res.render('output', {
                                shortUrl: sUrl,
                                longUrl: inputUrl,
                                list: topTenUrl
                            });
                        }).sort({
                            clicks: -1
                        }).limit(10);
                        //res.render('output',{shortUrl: sUrl, longUrl: inputUrl, list: {shortUrl: topTenUrl}})
                        console.log("created");
                    }
                });

            } else { // this long url is already in the database
                console.log("this url is already in the database");
                // display it shortener url
                UrlModel.find({}, function(err, list) {
                    var index;
                    for (index = 0; index < list.length; index++) {
                        //console.log(list[index].shortUrl);
                        //topTenUrl[index] = list[index].shortUrl;
                        topTenUrl.push(list[index].shortUrl);
                        //console.log("top ten inside call back function");
                        //console.log(topTenUrl);
                    }
                    res.render('output', {
                        shortUrl: result.shortUrl,
                        longUrl: result.longUrl,
                        list: topTenUrl
                    });
                }).sort({
                    clicks: -1
                }).limit(10);

            }

        });


    }

});


app.get('/:url', function(req, res) {
    var inputUrl;
    inputUrl = "localhost:3000/" + req.params.url;

    UrlModel.findOne({
        shortUrl: inputUrl
    }, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result === null) { // not thing found
            console.log("invalid short url");
        } else {
            console.log("already in the database");
            // increase clicks
            result.clicks += 1;
            console.log(result);
            result.save(function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("updated clicks");
                }
            });
            // deal with http:// and https://
            if (result.longUrl.substring(0, 7) === "http://") {
                res.redirect("http://" + result.longUrl.substring(7));
                //console.log(result.longUrl.substring(7));
            } else if (result.longUrl.substring(0, 8) === "https://") {
                res.redirect("http://" + result.longUrl.substring(8));
            } else {
                res.redirect("http://" + result.longUrl);
            }
        }
    });

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
// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
 
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
