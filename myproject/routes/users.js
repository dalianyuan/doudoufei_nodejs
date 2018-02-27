var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/top', function(req, res, next) {
  res.render('top', {});
});
router.get('/menu', function(req, res, next) {
  res.render('menu', {});
});
router.get('/main', function(req, res, next) {
  res.render('main', {});
});


module.exports = router;
