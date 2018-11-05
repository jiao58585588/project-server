/**
 * Created by 10560 on 2018/11/5.
 */
/**
 * Created by 10560 on 2018/10/31.
 */
//引入模块
const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const messagesSchema=new Schema({
  from:{
    type:String,
    required:true
  },
  to:{
    type:String,
    required:true
  },
  content:{
    type:String,
    required:true
  },
  create_time:{
    type:Date,
    default:Date.now()
  },
  chat_id:{
    type:String,
    required:true
  },
  read:{
    type:Boolean,
    default:false
  }
})
//创建模型对象
const Messages=mongoose.model('Messages',messagesSchema);
//暴露出去
module.exports=Messages;