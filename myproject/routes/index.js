var express = require('express');
var router = express.Router();
var UserModel = require("../model/UserModel");
var GoodsModel = require("../model/GoodsModel");
var multiparty = require("multiparty");

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('login', {});
});

/*后台主页面*/
router.get('/index', function(req, res, next) {
	//检查用户是否登录
	if(req.session && req.session.username != null) {
		res.render('index', {});
	} else {
		res.redirect('/');
	}
});

/*后台主页面头部*/
router.get('/top', function(req, res, next) {
	res.render('top', {});
});

/*后台主页面左侧导航菜单*/
router.get('/menu', function(req, res, next) {
	res.render('menu', {});
});

/*后台主页面主要内容区*/
router.get('/content', function(req, res, next) {
	res.render('content', {});
});

/*后台主页面添加商品区*/
router.get('/main', function(req, res, next) {
	res.render('main', {});
});

/*商品列表分页*/
router.get('/list', function(req, res, next) {
	GoodsModel.find({}, function(err, docs) {
		res.render('list', {
			list: docs,
			length: docs.length
		});
	})
});

router.get('/list.json', function(req, res, next) {
	GoodsModel.find({}, function(err, docs) {
		res.json({
			list: docs,
			length: docs.length
		});
	})
});

/*添加商品失败页面*/
router.get('/add_fail', function(req, res, next) {
	res.render('add_fail', {});
});

/* 登录 */
router.post('/api/login', function(req, res) {
	var username = req.body.username;
	var psw = req.body.psw;
	var result = {
		status: 1,
		message: "登录成功"
	}
	UserModel.find({
		username: username,
		psw: psw
	}, function(err, docs) {
		if(!err && docs.length > 0) {
			//			console.log("登录成功");
			req.session.username = username; //生成session
			res.send(result);
		} else {
			//			console.log("登录失败，请检查您的用户名或者密码");
			result.status = -109;
			result.message = "登录失败，请检查您的用户名或者密码";
			res.send(result);
		}
	})
})

/* 
 * 商品详情页面 
 * req.params.anything是前端点击时候传到后端的当前商品的goods_id
 * */
router.get('/goods_detail/:anything', function(req, res, next) {
	GoodsModel.find({
		goods_id: req.params.anything
	}, function(err, docs) {
		//		console.log(docs);
		res.render('goods_detail', {
			list: docs
		});
	})
});

/*商品列表分页*/
router.get('/api/list', function(req, res, next) {
	var gotoPage = parseInt(req.query.gotoPage); //当前页码
	var pageSize = parseInt(req.query.pageSize); //每页显示商品数量
	//	console.log( gotoPage,pageSize );
	var query = GoodsModel.find({}).skip((gotoPage - 1) * pageSize).limit(pageSize).sort({
		create_Date: -1
	});
	query.exec(function(err, docs) {
		if(!err) {
			//			console.log(docs);
			res.send(docs);
		} else {
			console.log("商品分页失败");
		}
	});
});

/* 添加商品 */
router.post("/add_goods", function(req, res) {
	var Form = new multiparty.Form({
		uploadDir: "./public/uploadImgs"
	})
	Form.parse(req, function(err, body, files) {
		var goods_name = body.goods_name[0];
		var goods_id = body.goods_id[0];
		var goods_price = body.goods_price[0];
		var count = body.count[0];
		var goods_num = body.goods_num[0];
		var picName = files.pic[0].path;
		picName = picName.substr(picName.lastIndexOf("\\") + 1);
		//		console.log(goods_name,goods_id,goods_price,count,goods_num,picName);

		var gm = new GoodsModel();
		gm.goods_name = goods_name;
		gm.goods_id = goods_id;
		gm.goods_price = goods_price;
		gm.count = count;
		gm.goods_num = goods_num;
		gm.pic = picName;
		gm.save(function(err) {
			if(!err) {
				/*商品添加成功之后跳转到列表页*/
				GoodsModel.find({}, function(err, docs) {
					res.render('list', {
						list: docs,
						length: docs.length
					});
				})
			} else {
				res.render('add_fail', {});
				//			res.send( "商品添加失败,您添加的商品货号已存在。请根据左侧导航菜单继续操作。谢谢！" );
			}
		})
	})
})

/* 删除商品行 */
router.post('/api/del_list', function(req, res, next) {
	var goods_name = req.body.goods_name;
	var goods_id = req.body.goods_id;
	//	console.log(req.body);//{ goods_name: 'goods02', goods_id: '002' }
	var del = {
		goods_name: goods_name,
		goods_id: goods_id
	};
	GoodsModel.remove(del, function(err, result) {
		if(!err) {
			console.log("删除成功");
		} else {
			console.log("删除失败");
		}
		//	  console.log(result);//{ n: 1, ok: 1 }
		res.send(result);
	});

});

/* 搜索--按商品名称进行模糊查询 */
router.post('/search_goods', function(req, res, next) {
	var goods_keywords = req.body.goods_keywords;
	console.log(goods_keywords);
	GoodsModel.find({
		goods_name: {
			$regex: goods_keywords
		}
	}, function(err, docs) {
		//			console.log( docs );
		res.send(docs);
	})
})

module.exports = router;