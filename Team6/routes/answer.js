var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/</answer', function(req, res, next) {
  res.render('answer');
});

module.exports = router;
