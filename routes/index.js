var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('index', { title: 'TODO LIST' });
});


router.get('/signup-in', function(req, res, next) {
  
  res.render('signup-in', { title: 'TODO LIST' });
});


module.exports = router;
