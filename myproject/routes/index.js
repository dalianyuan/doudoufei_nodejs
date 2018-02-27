var express = require('express');
var router = express.Router();
var UserModel = require( "../model/UserModel" );

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', {});
});

router.post('/api/login', function(req, res){
	var username = req.body.username;
	var psw = req.body.psw;
	var result = {
		status: 1,
		message: "登录成功"
	}
	UserModel.find({username: username, psw: psw}, function(err, docs){
		if(!err && docs.length > 0) {
			console.log("登录成功");
			res.send(result);
		} else {
			console.log("登录失败，请检查您的用户名或者密码");
			result.status = -109;
			result.message = "登录失败，请检查您的用户名或者密码"
			res.send(result);
		}
	})
})

router.get('/index', function(req, res, next) {
  res.render('index', {});
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
