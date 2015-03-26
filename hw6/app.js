var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var app = express();

// declare variables
var responses = ['rock','paper','scissors','lizard','spock'];
var result;
var rand;
var ai;
var resultObj={"player": "", "ai":"","message":"", "outcome":"", "wins":0, "losses":0, "ties":0};


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.locals.appdata = resultObj;

app.use('/', routes);

app.post('/play/rock', function(req,res){  
    console.log("rock");
    rand=Math.floor(Math.random()*5);
    ai = responses[rand];
    resultObj.ai= ai;
    console.log(ai);
    resultObj.player="rock";
    result = compRock(ai);
    updateResult(result);
    res.redirect('/');
    //res.json(resultObj);
});

app.post('/play/paper', function(req,res){  
    console.log("paper");
    rand=Math.floor(Math.random()*5);
    ai= responses[rand];
    resultObj.ai= ai;
    resultObj.player="paper";
    result = compPaper(ai);
    updateResult(result);
    res.redirect('/');
    //res.json(resultObj);
  
});

app.post('/play/scissors', function(req,res){  
    console.log("scissors");
    rand=Math.floor(Math.random()*5);
    ai= responses[rand];
    resultObj.ai= ai;
    resultObj.player="scissors";
    result = compScissors(ai);
    updateResult(result);
    res.redirect('/');
    //res.json(resultObj);
  
});

app.post('/play/lizard', function(req,res){  
    console.log("lizard");
    rand=Math.floor(Math.random()*5);
    ai= responses[rand];
    resultObj.ai= ai;
    resultObj.player="lizard";
    result = compLizard(ai);
    updateResult(result);
    res.redirect('/');
    //res.json(resultObj);
  
});

app.post('/play/spock', function(req,res){  
    console.log("spock");
    rand=Math.floor(Math.random()*5);
    ai= responses[rand];
    resultObj.ai= ai;
    resultObj.player="spock";
    result = compSpock(ai);
    updateResult(result);
    res.redirect('/');
    //res.json(resultObj);  
});


var compRock=function(ai){  
  switch(ai){
    case "rock":
      return 0;
    case "paper":
    case "spock":
      return -1;
    case "scissors": 
    case "lizard":
      return 1;
  }     
};


var compPaper = function(ai){
  switch(ai){
    case "paper":
      return 0;
    case "rock":
    case "spock":
      return 1;
    case "scissors":
    case "lizard":
      return -1;
  } 
};

var compScissors= function(ai){
  switch(ai){
    case "scissors":
      return 0;
    case "rock":
    case "spock":
      return -1;
    case "paper":
    case "lizard":
      return 1;
  }
};

var compLizard= function(ai){
  switch(ai){
    case "lizard":
      return 0;
    case "rock":
    case "scissors":
      return -1;
    case "paper":
    case "spock":
      return 1;
  }
};

var compSpock= function(ai){
  switch(ai){
    case "spock":
      return 0;
    case "rock":
    case "scissors":
      return 1;
    case "paper":
    case "lizard":
      return -1;
  }
};

function updateResult(val){
  if (result ===1){
    resultObj.wins ++;
    resultObj.message = "You win";
  } else if(result === 0){
    resultObj.ties ++;
    resultObj.message = "We tie";
  } else if(result === -1){
    resultObj.losses ++;
    resultObj.message = "Hahaha, you lost";
  }
  updateOutcome();
}

function updateOutcome(){
  if(resultObj.wins > resultObj.losses){
    resultObj.outcome="win";
  } else if (resultObj.wins < resultObj.losses){
    resultObj.outcome="lose";
  } else{
    resultObj.outcome="tie";
  }
}

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
