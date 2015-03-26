var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Homework #6 - Rock, Paper, Scissor, Lizard, Spock' });
});

module.exports = router;
