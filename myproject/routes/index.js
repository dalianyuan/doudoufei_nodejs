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

router.post("/api/add_goods", function(req, res){
	var Form = new multiparty.Form({
		uploadDir: "./public/images"
	})
	Form.parse(req, function(err, body, files){
		var goods_name = body.goods_name[0];
		var goods_id = body.goods_id[0];
		var goods_price = body.goods_price[0];
		var count = body.count[0];
		var goods_num = body.goods_num[0];
		var picName = files.pic[0].path;
		picName = picName.substr(picName.lastIndexOf("\\") + 1);

		var gm = new GoodsModel();
		gm.goods_name = goods_name;
		gm.goods_id = goods_id;
		gm.goods_price = goods_price;
		gm.count = count;
		gm.goods_num = goods_num;
		gm.picName = picName;
		gm.save(function(err){
			if(!err) {
				res.send("商品保存成功");
			} else {
				res.send("商品保存失败");
			}
		})
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
router.get('/content', function(req, res, next) {
  res.render('content', {});
});
router.get('/main', function(req, res, next) {
  res.render('main', {});
});
router.get('/list', function(req, res, next) {
  res.render('list', {});
});

module.exports = router;
