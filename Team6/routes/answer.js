var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/</answer', function(req, res, next) {
  res.render('answer',{ title: 'CPSC 473 Project' });
});

module.exports = router;
