var mongoose = require( "mongoose" );
var Schema = mongoose.Schema;
 
/*创建文档定义*/
var User = new Schema({
    username    : String,
    psw         : String,
    login_Date  : { type: Date, default: Date.now }
});

/*创建model对象，与数据库中的文档（表）映射*/
var UserModel = mongoose.model('user', User, 'users');

module.exports = UserModel;