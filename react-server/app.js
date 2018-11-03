/**
 * Created by 10560 on 2018/10/31.
 */
//需要全局安装npm i nodemon -g
const db=require('./db/index');
const express=require('express');
const app=express();
const router=require('./router');
/*db
    .then(()=>{
    app.use(router);
})*/

(async ()=>{
    await db
    app.use(router);
})();
app.listen(4000,err=>{
    if(!err) console.log('服务器启动成功了');
    else console.log(err);
})