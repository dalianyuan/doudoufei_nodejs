var express = require('express');
var router = express.Router();
var UserModel = require( "../model/UserModel" );
var GoodsModel = require( "../model/GoodsModel" );
var multiparty = require( "multiparty" );

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', {});
}); 

/*后台主页面*/
router.get('/index', function(req, res, next) {
  res.render('index', {});
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

/*添加商品失败页面*/
router.get('/add_fail', function(req, res, next) {
  res.render('add_fail', {});
});

/* 
 * 商品详情页面 
 * req.params.anything是前端点击时候传到后端的当前商品的goods_id
 * */
router.get('/goods_detail/:anything', function(req, res, next) {
	GoodsModel.find({goods_id:req.params.anything}, function(err, docs) {
		console.log(docs);
		res.render('goods_detail', {list: docs});
	})
});

/*商品列表页*/
router.get('/list', function(req, res, next) {
	GoodsModel.find({}, function(err, docs) {
		res.render('list', {list: docs});
	})
});

/* 登录 */
router.post('/api/login', function(req, res){
	var username = req.body.username;
	var psw = req.body.psw;
	var result = {
		status: 1,
		message: "登录成功"
	}
	UserModel.find({username: username, psw: psw}, function(err, docs){
		if(!err && docs.length > 0) {
//			console.log("登录成功");
			res.send(result);
		} else {
//			console.log("登录失败，请检查您的用户名或者密码");
			result.status = -109;
			result.message = "登录失败，请检查您的用户名或者密码";
			res.send(result);
		}
	})
})

/* 添加商品 */
router.post("/add_goods", function(req, res){
	var Form = new multiparty.Form({
		uploadDir: "./public/uploadImgs"
	})
	Form.parse(req, function(err, body, files){
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
		gm.save(function(err){
			if(!err) {
				/*商品添加成功之后跳转到列表页*/
				GoodsModel.find({}, function(err, docs) {
					res.render('list', {list: docs});
				})
			} else {
  			res.render('add_fail', {});
//			res.send( "商品添加失败,您添加的商品货号已存在。请根据左侧导航菜单继续操作。谢谢！" );
			}
		})
	})
})

/* 删除商品行 */
router.post('/api/list', function(req, res, next) {
	var goods_name = req.body.goods_name;
	var goods_id = req.body.goods_id;
	console.log(req.body);//{ goods_name: 'goods02', goods_id: '002' }
	var del = { goods_name: goods_name, goods_id: goods_id };
	GoodsModel.remove(del,function(err,result){
	  if( !err ){
	    console.log( "删除成功" );
	  }else{
	  	console.log( "删除失败" );
	  }
	  console.log(result);//{ n: 1, ok: 1 }
	  res.send( result );
	});
	
});

/* 搜索--按商品名称进行模糊查询 */
router.post('/search_goods', function(req, res, next){
	var form = new multiparty.Form();
	form.parse(req, function(err, body, files) {
	  var goods_keywords = body.goods_keywords[0];
	  GoodsModel.find({ goods_name: { $regex: goods_keywords } }, function(err, docs) {
	  	res.render('list', {list: docs});
	  })
	});
})

module.exports = router;
