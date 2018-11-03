/**
 * Created by 10560 on 2018/10/31.
 */
const mongoose=require('mongoose');

module.exports=new Promise((resolve,reject)=>{
    mongoose.connect('mongodb://localhost:27017/gzhipin1',{useNewUrlParser:true});
    mongoose.connection.once('open',err=>{
        if(!err){
            console.log('数据连接成功');
            resolve();
        }else{
            console.log(err);
            reject(err);
        };
    })
})