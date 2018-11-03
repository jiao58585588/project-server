/**
 * Created by 10560 on 2018/10/31.
 */
//引入模块
const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const usersSchema=new Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    header:String,
    post:String,
    company:String,
    salary:String,
    info:String
})
//创建模型对象
const Users=mongoose.model('Users',usersSchema);
//暴露出去
module.exports=Users;