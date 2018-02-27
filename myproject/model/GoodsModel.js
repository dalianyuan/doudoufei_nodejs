var mongoose = require( "mongoose" );
var Schema = mongoose.Schema;
 
/*创建文档定义*/
var Goods = new Schema({
    goods_name  : String,//商品名称
    goods_id    : String,//货号
    goods_price : String,//本店价格
    count       : Number,//库存
    goods_num   : Number,//虚拟销量
    pic         : String,//商品图片
    create_Date : { type: Date, default: Date.now }
});

/*创建model对象，与数据库中的文档（表）映射*/
var GoodsModel = mongoose.model('goods', Goods);

/*使用commonJS规范暴露接口*/
module.exports = GoodsModel;