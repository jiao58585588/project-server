/**
 * Created by 10560 on 2018/10/31.
 */
//需要全局安装npm i nodemon -g
const db=require('./db/index');
const http=require('http');
const express=require('express');
const app=express();
const server=http.createServer(app);
const router=require('./router');
require('./socketIO')(server);
server.listen(5000,()=>{
  console.log('服务器2启动成功了');
});
//此处一定不能忘加分号
(async ()=>{
    await db
    app.use(router);
})();
app.listen(4000,err=>{
    if(!err) console.log('服务器启动成功了');
    else console.log(err);
})